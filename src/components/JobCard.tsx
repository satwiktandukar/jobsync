import { Avatar, Box, Paper, Typography } from "@mui/material";
import viteLogo from "/img.jpg";
import type { Job } from "../types/Job";

export default function JobCard({
  job,
  setSelectedJob,
  setJobWindowOpen,
}: {
  job: Job;
  setSelectedJob: (job: Job) => void;
  setJobWindowOpen: (open: boolean) => void;
}) {
  return (
    <Box key={job.id}>
      <Paper
        elevation={3}
        sx={{
          height: "80px",
          width: "100%",
          borderRadius: "20px",
          cursor: "pointer",
          flexShrink: 0,
          // alignItems: "center",
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
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {job.logo ? <Avatar src={job.logo} /> : <Avatar src={viteLogo} />}
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
    </Box>
  );
}
