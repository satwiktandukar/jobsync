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
      currentSection,
    },
  });

  return (
    <Box ref={ref}>
      <Paper
        elevation={0}
        sx={(theme) => ({
          height: "82px",

          width: "100%",

          borderRadius: "22px",

          cursor: "grab",

          flexShrink: 0,

          overflow: "hidden",

          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.72)",

          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.65)",

          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 20px rgba(0,0,0,0.22)"
              : "0 8px 20px rgba(0,0,0,0.06)",

          transition: "all 0.18s ease",

          "&:hover": {
            transform: "translateY(-2px)",
          },

          "&:active": {
            cursor: "grabbing",
          },
        })}
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

            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              flex: 1,

              display: "flex",

              flexDirection: "row",

              gap: "12px",

              alignItems: "center",

              px: 2,

              minWidth: 0,
            }}
          >
            <Avatar
              src={job.logo || viteLogo}
              sx={{
                width: 46,
                height: 46,
              }}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",

                minWidth: 0,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {job.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {job.company}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={(theme) => ({
              width: "6px",

              height: "60%",

              borderRadius: "999px",

              mr: 2,

              background:
                theme.palette.mode === "dark"
                  ? "rgba(124,92,255,0.7)"
                  : "rgba(124,92,255,0.55)",
            })}
          />
        </Box>
      </Paper>
    </Box>
  );
}
