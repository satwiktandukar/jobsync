import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import { Avatar, Typography } from "@mui/material";
import { fetch_applications } from "./services/application_service";
import type { Application } from "./services/application_service";
import JobForm from "./JobForm";
import JobWindow from "./JobWindow";
function App() {
  useEffect(() => {
    fetch_applications().then((data: Application[]) => {
      console.log(data);
    });
  });

  type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    description: string;
    category: "IT" | "Cybersecurity" | "Other"; //more categoeries can be added as needed.
    logo: string; //perhaps I will have a directory of images user can upload to with the company logo.
  };

  const [addformShow, setAddFormShow] = useState(false);
  const [jobs, setjobs] = useState<Job[]>([
    {
      id: 1,
      title: "Junior Software Developer",
      company: "Tech Company A",
      location: "New York, NY",
      salary: "$60,000 - $80,000",
      description: "An entry-level position for aspiring software developers.",
      logo: "/path/to/logoA.png",
      category: "IT",
    },
    {
      id: 2,
      title: "Cybersecurity Analyst",
      company: "Cybersecurity Firm B",
      location: "San Francisco, CA",
      salary: "$70,000 - $90,000",
      description:
        "Responsible for monitoring and protecting the organization's network.",
      logo: "/path/to/logoB.png",
      category: "Cybersecurity",
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "Web Agency C",
      location: "Chicago, IL",
      salary: "$65,000 - $85,000",
      description:
        "Develop and maintain user-facing features using React and TypeScript.",
      logo: "/path/to/logoC.png",
      category: "IT",
    },
  ]);

  function addJob(job: Job) {
    setjobs([...jobs, job]);
  }

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobWindowOpen, setJobWindowOpen] = useState(false);

  return (
    <Container maxWidth="sm">
      <div className="App">
        <AppBar
          sx={{
            height: "64px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <Button
            color="inherit"
            startIcon={<ArrowDropDownIcon />}
            sx={{ width: "100px", borderRadius: 12 }}
          >
            Software Engineering
          </Button>
          <Button
            color="inherit"
            startIcon={<ArrowDropDownIcon />}
            sx={{ width: "100px", borderRadius: 12 }}
          >
            Cybersecurity
          </Button>
        </AppBar>
        <JobForm
          open={addformShow}
          addJob={addJob}
          close={() => setAddFormShow(false)}
        />
        <JobWindow
          open={jobWindowOpen}
          onClose={() => {
            setJobWindowOpen(false);
          }}
          job={selectedJob}
        />
        <Box
          sx={{ display: "flex", flexDirection: "row", h: "100%", w: "100%" }}
        >
          <Card
            sx={{
              height: "500px",
              width: "240px",
              margin: "20px",
              overflowY: "scroll",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Box
              width={"100%"}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: "10px",
                mb: "10px",
              }}
            >
              <Avatar src={viteLogo} />
            </Box>
            <Box
              sx={{
                ml: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h5">WishList</Typography>
              <Button
                variant="contained"
                sx={{ mt: "10px", backgroundColor: "#0FFF1B" }}
                onClick={() => setAddFormShow(true)}
              >
                + Add{" "}
              </Button>
            </Box>
            {jobs.map((job) => (
              <React.Fragment key={job.id}>
                <Paper
                  elevation={3}
                  sx={{
                    height: "80px",
                    width: "235px",
                    mt: "20px",
                    borderRadius: "20px",
                  }}
                  onClick={() => {
                    setSelectedJob(job);
                    setJobWindowOpen(true);
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "155px",
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <Avatar src={viteLogo} />
                      <Box sx={{ display: "flex", flexDirection: "Column" }}>
                        {" "}
                        <Typography variant="body2">{job.title}</Typography>
                        <Typography variant="body2" color={"#888888"}>
                          {job.company}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: "80px",
                        height: "100%",
                        backgroundColor: "#ff2e2e",
                        borderRadius: "0 20px 20px 0",
                      }}
                    ></Box>{" "}
                  </Box>
                </Paper>
              </React.Fragment>
            ))}
          </Card>
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
          {" "}
          hello
        </Drawer>
      </div>
    </Container>
  );
}

export default App;
