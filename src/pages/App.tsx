import { useEffect, useMemo, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import "../App.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ForumIcon from "@mui/icons-material/Forum";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CancelIcon from "@mui/icons-material/Cancel";
import ArchiveIcon from "@mui/icons-material/Archive";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import JobForm from "../components/JobForm";
import JobSection from "../components/JobSection";
import JobWindow from "../components/JobWindow";
import Navbar from "../components/Navbar";

import type { Job, JobUpdate, Category } from "../types/Job";
import { demoJobs } from "../demoData";
import {
  create_category,
  delete_category,
  get_applications,
  get_categories,
  update_application,
} from "../services/application_service";
import {
  SECTIONS,
  sectionToStatus,
  statusToSection,
  type SectionName,
} from "../utils/jobStatus";

function App() {
  const empty_job: Job = {
    id: 99999,
    title: "",
    company: "",
    location: "",
    salary: 0,
    description: "",
    category_id: null,
    logo: "",
    status: "wishlist",
  };

  const [addformShow, setAddFormShow] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(demoJobs);

  const [selectedJob, setSelectedJob] = useState<Job>(empty_job);
  const [jobWindowOpen, setJobWindowOpen] = useState(false);
  const [section, setSection] = useState<SectionName>("Wish List");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "All">(
    "All",
  );
  const [mode, setMode] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    async function fetch_data() {
      const applications = await get_applications();
      const categories = await get_categories();

      setJobs(applications);
      setCategories(categories);
    }

    fetch_data();
  }, []);

  const filteredJobs = useMemo(() => {
    if (selectedCategory === "All") {
      return jobs;
    }

    return jobs.filter((job) => job.category_id === selectedCategory);
  }, [jobs, selectedCategory]);

  const sections = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((name) => [
          name,
          filteredJobs.filter((job) => statusToSection[job.status] === name),
        ]),
      ) as Record<SectionName, Job[]>,
    [filteredJobs],
  );

  async function handleAddCategory() {
    const category = prompt("Enter category name:");

    if (!category) return;

    const cleanedCategory = category.trim();

    if (!cleanedCategory) return;

    const alreadyExists = categories.some(
      (existing) =>
        existing.title.toLowerCase() === cleanedCategory.toLowerCase(),
    );

    if (alreadyExists) return;

    try {
      const createdCategory = await create_category(cleanedCategory);

      setCategories((prev) => [...prev, createdCategory]);
      setSelectedCategory(createdCategory.id);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteCategory(category: Category) {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));

    if (selectedCategory === category.id) {
      setSelectedCategory("All");
    }

    try {
      await delete_category(category.id);
    } catch (error) {
      console.error(error);
      setSelectedCategory("All");
      alert("Failed to delete category.");
    }
  }

  function handleReorderCategories(nextCategories: Category[]) {
    setCategories(nextCategories);
  }

  function addJob(job: Job) {
    setJobs((prev) => [...prev, job]);
  }

  function updateJob(updated: Job) {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    setSelectedJob(updated);
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          background: {
            default: mode === "dark" ? "#0f1115" : "#f4f7fb",
            paper: mode === "dark" ? "#1a1d24" : "#ffffff",
          },

          primary: {
            main: "#7c5cff",
          },

          success: {
            main: "#5ac85a",
          },
        },

        shape: {
          borderRadius: 18,
        },

        typography: {
          fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',

          h6: {
            fontWeight: 700,
          },

          button: {
            textTransform: "none",
            fontWeight: 600,
          },
        },

        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                transition: "all 0.2s ease",
              },
            },
          },

          MuiPaper: {
            styleOverrides: {
              root: {
                transition: "all 0.2s ease",
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;

          const sourceSection = event.operation.source?.data
            ?.currentSection as SectionName;

          const targetSection = event.operation.target?.id as SectionName;

          const draggedJob = event.operation.source?.data?.job as Job;

          if (!sourceSection || !targetSection || !draggedJob) return;

          if (sourceSection === targetSection) return;

          const newStatus = sectionToStatus[targetSection];

          setJobs((prev) =>
            prev.map((job) =>
              job.id === draggedJob.id ? { ...job, status: newStatus } : job,
            ),
          );

          const update_data: JobUpdate = { status: newStatus };
          update_application(draggedJob.id, update_data);
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ overflow: "visible" }}>
          <Box
            className="App"
            sx={{
              minHeight: "100vh",

              overflow: "visible",

              scrollbarWidth: "none",

              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Navbar
              mode={mode}
              setMode={setMode}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onReorderCategories={handleReorderCategories}
            />

            <JobForm
              open={addformShow}
              addJob={addJob}
              jobSection={section}
              close={() => setAddFormShow(false)}
              category={
                selectedCategory === "All"
                  ? null
                  : (categories.find((c) => c.id === selectedCategory) ?? null)
              }
            />

            <JobWindow
              open={jobWindowOpen}
              onClose={() => setJobWindowOpen(false)}
              job={selectedJob}
              onJobUpdated={updateJob}
            />

            <Box
              className="hide-scrollbar"
              sx={{
                display: "flex",
                flexDirection: "row",

                height: "calc(100vh - 88px)",
                width: "100%",

                overflowX: "auto",
                overflowY: "hidden",

                px: 3,
                py: 2.5,

                gap: 2.5,

                alignItems: "flex-start",

                scrollbarWidth: "none",

                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <JobSection
                title="Wish List"
                icon={<FavoriteIcon />}
                jobs={sections["Wish List"]}
                setSelectedJob={setSelectedJob}
                setJobWindowOpen={setJobWindowOpen}
                setAddFormShow={setAddFormShow}
                setSection={setSection}
              />

              <JobSection
                title="Applied"
                icon={<AssignmentTurnedInIcon />}
                jobs={sections.Applied}
                setSelectedJob={setSelectedJob}
                setJobWindowOpen={setJobWindowOpen}
                setAddFormShow={setAddFormShow}
                setSection={setSection}
              />

              <JobSection
                title="Interviewing"
                icon={<ForumIcon />}
                jobs={sections.Interviewing}
                setSelectedJob={setSelectedJob}
                setJobWindowOpen={setJobWindowOpen}
                setAddFormShow={setAddFormShow}
                setSection={setSection}
              />

              <JobSection
                title="Offers"
                icon={<LocalOfferIcon />}
                jobs={sections.Offers}
                setSelectedJob={setSelectedJob}
                setJobWindowOpen={setJobWindowOpen}
                setAddFormShow={setAddFormShow}
                setSection={setSection}
              />

              <JobSection
                title="Rejected"
                icon={<CancelIcon />}
                jobs={sections.Rejected}
                setSelectedJob={setSelectedJob}
                setJobWindowOpen={setJobWindowOpen}
                setAddFormShow={setAddFormShow}
                setSection={setSection}
              />

              <JobSection
                title="Archived"
                icon={<ArchiveIcon />}
                jobs={sections.Archived}
                setSelectedJob={setSelectedJob}
                setJobWindowOpen={setJobWindowOpen}
                setAddFormShow={setAddFormShow}
                setSection={setSection}
              />
            </Box>
          </Box>
        </Container>
      </DragDropProvider>
    </ThemeProvider>
  );
}

export default App;
