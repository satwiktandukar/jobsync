import { useEffect, useState } from "react";
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

function App() {
  const [addformShow, setAddFormShow] = useState(false);

  const [wishlistJobs, setwishlistJobs] = useState<Job[]>(wishlist);
  const [appliedJobs, setappliedJobs] = useState<Job[]>(applied);
  const [interviewingJobs, setinterviewingJobs] = useState<Job[]>(interviewing);
  const [offerJobs, setofferJobs] = useState<Job[]>(offer);
  const [rejectedJobs, setrejectedJobs] = useState<Job[]>(rejected);
  const [archivedJobs, setarchivedJobs] = useState<Job[]>(archived);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobWindowOpen, setJobWindowOpen] = useState(false);

  const [section, setSection] = useState<string>("wishlist");

  useEffect(() => {
    fetch_applications().then((data: Application[]) => {
      console.log(data);
    });
  });

  function addJob(job: Job, section: string) {
    switch (section) {
      case "Wish List":
        console.log("wish list job added");
        setwishlistJobs([...wishlistJobs, job]);
        break;
      case "Applied":
        setappliedJobs([...appliedJobs, job]);
        break;
      case "Interviewing":
        setinterviewingJobs([...interviewingJobs, job]);
        break;
      case "Offers":
        setofferJobs([...offerJobs, job]);
        break;
      case "Rejected":
        setrejectedJobs([...rejectedJobs, job]);
        break;
      case "Archived":
        setarchivedJobs([...archivedJobs, job]);
        break;
    }
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      <Box
        className="App"
        sx={{
          overflow: "hidden",
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
            jobs={wishlistJobs}
            setSelectedJob={setSelectedJob}
            setJobWindowOpen={setJobWindowOpen}
            setAddFormShow={setAddFormShow}
            setSection={setSection}
          />
          <JobSection
            title="Applied"
            icon={<FavoriteIcon />}
            jobs={appliedJobs}
            setSelectedJob={setSelectedJob}
            setJobWindowOpen={setJobWindowOpen}
            setAddFormShow={setAddFormShow}
            setSection={setSection}
          />
          <JobSection
            title="Interviewing"
            icon={<FavoriteIcon />}
            jobs={interviewingJobs}
            setSelectedJob={setSelectedJob}
            setJobWindowOpen={setJobWindowOpen}
            setAddFormShow={setAddFormShow}
            setSection={setSection}
          />
          <JobSection
            title="Offers"
            icon={<FavoriteIcon />}
            jobs={offerJobs}
            setSelectedJob={setSelectedJob}
            setJobWindowOpen={setJobWindowOpen}
            setAddFormShow={setAddFormShow}
            setSection={setSection}
          />
          <JobSection
            title="Rejected"
            icon={<FavoriteIcon />}
            jobs={rejectedJobs}
            setSelectedJob={setSelectedJob}
            setJobWindowOpen={setJobWindowOpen}
            setAddFormShow={setAddFormShow}
            setSection={setSection}
          />
          <JobSection
            title="Archived"
            icon={<FavoriteIcon />}
            jobs={archivedJobs}
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
  );
}

export default App;
