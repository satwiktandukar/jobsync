import { useEffect, useState } from "react";
import "./App.css";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";

import JobForm from "./components/JobForm";
import JobSection from "./components/JobSection";
import JobWindow from "./components/JobWindow";
import Navbar from "./components/Navbar";

import { fetch_applications } from "./services/application_service";
import type { Application } from "./services/application_service";
import type { Job } from "./types/Job";

function App() {
  const [addformShow, setAddFormShow] = useState(false);

  const [jobs, setjobs] = useState<Job[]>([
    {
      id: 1,
      title: "Junior Software Developer",
      company: "Tech Company A",
      location: "New York, NY",
      salary: "$60,000 - $80,000",
      description: "An entry-level position for aspiring software developers.",
      category: "IT",
      logo: null,
    },
    {
      id: 2,
      title: "Cybersecurity Analyst",
      company: "Cybersecurity Firm B",
      location: "San Francisco, CA",
      salary: "$70,000 - $90,000",
      description:
        "Responsible for monitoring and protecting the organization's network.",
      category: "Cybersecurity",
      logo: null,
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Web Agency C",
      location: "Chicago, IL",
      salary: "$65,000 - $85,000",
      description:
        "Develop and maintain user-facing features using React and TypeScript.",
      category: "IT",
      logo: null,
    },
  ]);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobWindowOpen, setJobWindowOpen] = useState(false);

  useEffect(() => {
    fetch_applications().then((data: Application[]) => {
      console.log(data);
    });
  });

  function addJob(job: Job) {
    setjobs([...jobs, job]);
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

      <Box className="App" sx={{ overflow: "hidden" }}>
        <Navbar />

        <JobForm
          open={addformShow}
          addJob={addJob}
          close={() => setAddFormShow(false)}
        />

        <JobWindow
          open={jobWindowOpen}
          onClose={() => setJobWindowOpen(false)}
          job={selectedJob}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            height: "calc(100vh - 80px)",
            width: "100%",
          }}
        >
          <JobSection
            title="Wish List"
            icon={<FavoriteIcon />}
            jobs={jobs}
            setSelectedJob={setSelectedJob}
            setJobWindowOpen={setJobWindowOpen}
            setAddFormShow={setAddFormShow}
          />
        </Box>

        <Drawer
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
        </Drawer>
      </Box>
    </Container>
  );
}

export default App;
