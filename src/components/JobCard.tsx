import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/react";
import viteLogo from "/img.jpg";
import type { Job } from "../types/Job";

export default function JobCard({
  job,
  setSelectedJob,
  setJobWindowOpen,
  currentSection,
}: {
  job: Job;
  setSelectedJob: (job: Job) => void;
  setJobWindowOpen: (open: boolean) => void;
  currentSection: string;
}) {
  const { ref } = useDraggable({
    id: job.id ?? `temp-${job.title}-${job.company}`,
    data: {
      job,
      currentSection: currentSection,
    },
  });

  return (
    <Box ref={ref}>
      <Paper
        elevation={3}
        sx={{
          height: "80px",
          width: "100%",
          borderRadius: "20px",
          cursor: "grab",
          flexShrink: 0,
          overflow: "hidden",
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
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              px: 2,
            }}
          >
            {job.logo ? <Avatar src={job.logo} /> : <Avatar src={viteLogo} />}

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2">{job.title}</Typography>
              <Typography variant="body2" color="#888888">
                {job.company}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "80px",
              height: "100%",
              backgroundColor: "#ff2e2e",
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
