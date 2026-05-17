import { useEffect, useMemo, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import "./App.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ForumIcon from "@mui/icons-material/Forum";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CancelIcon from "@mui/icons-material/Cancel";
import ArchiveIcon from "@mui/icons-material/Archive";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import JobForm from "./components/JobForm";
import JobSection from "./components/JobSection";
import JobWindow from "./components/JobWindow";
import Navbar from "./components/Navbar";

import type { Job, JobUpdate } from "./types/Job";
import { demoJobs } from "./demoData";
import { get_applications, update_application } from "./services/application_service";
import {
  SECTIONS,
  sectionToStatus,
  statusToSection,
  type SectionName,
} from "./utils/jobStatus";

function App() {
  const empty_job: Job = {  
    id: 99999,
    title: "",
    company: "",
    location: "",
    salary: 0,
    description: "",
    category: "",
    logo: "",
    status: "wishlist",
  }

  const [addformShow, setAddFormShow] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(demoJobs);
  const [selectedJob, setSelectedJob] = useState<Job >(empty_job);
  const [jobWindowOpen, setJobWindowOpen] = useState(false);
  const [section, setSection] = useState<SectionName>("Wish List");

  useEffect( () =>{ async function fetch_data() {
    const data =await get_applications();
    setJobs(data);

  }
  fetch_data();
},[])

  const sections = useMemo(
    () =>
      Object.fromEntries(
        SECTIONS.map((name) => [
          name,
          jobs.filter((job) => statusToSection[job.status] === name),
        ]),
      ) as Record<SectionName, Job[]>,
    [jobs],
  );

  function addJob(job: Job) {
    setJobs((prev) => [...prev, job]);
  }

  function updateJob(updated: Job) {
    setJobs((prev) =>
      prev.map((j) => (j.id === updated.id ? updated : j)),
    );
    setSelectedJob(updated);
  }

  const [mode, setMode] = useState<"light" | "dark">(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );


  return (
    <ThemeProvider theme={theme}>
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
          const update_data: JobUpdate = {status: newStatus}
          update_application(draggedJob.id, update_data);
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            overflow: "visible",
          }}
        >
          <CssBaseline />

          <Box
            className="App"
            sx={{
              overflow: "visible",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Navbar mode={mode} setMode={setMode} />

            <JobForm
              open={addformShow}
              addJob={addJob}
              jobSection={section}
              close={() => setAddFormShow(false)}
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
                height: "calc(100vh - 120px)",
                width: "100%",
                overflowX: "auto",
                overflowY: "hidden",
                px: "20px",
                gap: "16px",
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
