import { useEffect, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import "./App.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import JobForm from "./components/JobForm";
import JobSection from "./components/JobSection";
import JobWindow from "./components/JobWindow";
import Navbar from "./components/Navbar";

import { fetch_applications } from "./services/application_service";
import type { Application } from "./services/application_service";
import type { Job } from "./types/Job";
import {
  applied,
  archived,
  interviewing,
  offer,
  rejected,
  wishlist,
} from "./demoData";
import JobCard from "./components/JobCard";

function App() {
  const [addformShow, setAddFormShow] = useState(false);

  const [sections, setSections] = useState({
    "Wish List": wishlist,
    Applied: applied,
    Interviewing: interviewing,
    Offers: offer,
    Rejected: rejected,
    Archived: archived,
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobWindowOpen, setJobWindowOpen] = useState(false);

  const [section, setSection] = useState<string>("wishlist");
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const [isDropped, setIsDropped] = useState(false);

  // useEffect(() => {
  //   fetch_applications().then((data: Application[]) => {
  //     console.log(data);
  //   });
  // });

  function addJob(job: Job, section: string) {
    switch (section) {
      case "Wish List":
        console.log("wish list job added");
        setSections((prev) => ({
          ...prev,
          "Wish List": [...prev["Wish List"], job],
        }));
        break;
      case "Applied":
        setSections((prev) => ({
          ...prev,
          Applied: [...prev.Applied, job],
        }));
        break;
      case "Interviewing":
        setSections((prev) => ({
          ...prev,
          Interviewing: [...prev.Interviewing, job],
        }));
        break;
      case "Offers":
        setSections((prev) => ({
          ...prev,
          Offers: [...prev.Offers, job],
        }));
        break;
      case "Rejected":
        setSections((prev) => ({
          ...prev,
          Rejected: [...prev.Rejected, job],
        }));
        break;
      case "Archived":
        setSections((prev) => ({
          ...prev,
          Archived: [...prev.Archived, job],
        }));
        break;
    }
  }
  type SectionName =
    | "Wish List"
    | "Applied"
    | "Interviewing"
    | "Offers"
    | "Rejected"
    | "Archived";

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const sourceSection = event.operation.source?.data
          ?.currentSection as SectionName;

        const targetSection = event.operation.target?.id as SectionName;

        const draggedJob = event.operation.source?.data?.job as Job;
        if (!sourceSection || !targetSection || !draggedJob) return;

        if (sourceSection === targetSection) return;

        setSections((prev) => ({
          ...prev,
          [sourceSection]: prev[sourceSection].filter(
            (job) => job.id !== draggedJob.id,
          ),
          [targetSection]: [...prev[targetSection], draggedJob],
        }));
        console.log({
          source: event.operation.source,
          target: event.operation.target,
          sourceSection,
          targetSection,
          draggedJob,
        });
      }}
    >
      {" "}
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
          <Navbar />

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
              icon={<FavoriteIcon />}
              jobs={sections.Applied}
              setSelectedJob={setSelectedJob}
              setJobWindowOpen={setJobWindowOpen}
              setAddFormShow={setAddFormShow}
              setSection={setSection}
            />
            <JobSection
              title="Interviewing"
              icon={<FavoriteIcon />}
              jobs={sections.Interviewing}
              setSelectedJob={setSelectedJob}
              setJobWindowOpen={setJobWindowOpen}
              setAddFormShow={setAddFormShow}
              setSection={setSection}
            />
            <JobSection
              title="Offers"
              icon={<FavoriteIcon />}
              jobs={sections.Offers}
              setSelectedJob={setSelectedJob}
              setJobWindowOpen={setJobWindowOpen}
              setAddFormShow={setAddFormShow}
              setSection={setSection}
            />
            <JobSection
              title="Rejected"
              icon={<FavoriteIcon />}
              jobs={sections.Rejected}
              setSelectedJob={setSelectedJob}
              setJobWindowOpen={setJobWindowOpen}
              setAddFormShow={setAddFormShow}
              setSection={setSection}
            />
            <JobSection
              title="Archived"
              icon={<FavoriteIcon />}
              jobs={sections.Archived}
              setSelectedJob={setSelectedJob}
              setJobWindowOpen={setJobWindowOpen}
              setAddFormShow={setAddFormShow}
              setSection={setSection}
            />
          </Box>

          {/* <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              backgroundColor: "#2F2136",
              border: "none",
              width: 50,
            },
          }}
        >
          hello
        </Drawer> */}
        </Box>
      </Container>
    </DragDropProvider>
  );
}

export default App;
