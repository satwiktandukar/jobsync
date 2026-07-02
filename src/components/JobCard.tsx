import { Avatar, Box, Chip, Paper, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/react";
import BusinessIcon from "@mui/icons-material/Business";

import { BASE_URL } from "../services/application_service";
import type { Job } from "../types/Job";

function getDeadlineChip(deadline: string | null): { label: string; color: string } | null {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: "Overdue", color: "#ef4444" };
  if (diffDays === 0) return { label: "Today", color: "#ef4444" };
  if (diffDays <= 3) return { label: `${diffDays}d left`, color: "#f97316" };
  if (diffDays <= 7) return { label: `${diffDays}d left`, color: "#f59e0b" };
  return null;
}

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
    data: { job, currentSection },
  });

  const deadlineInfo = getDeadlineChip(job.deadline);

  return (
    <Box ref={ref}>
      <Paper
        elevation={0}
        sx={(theme) => ({
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
          "&:hover": { transform: "translateY(-2px)" },
          "&:active": { cursor: "grabbing" },
        })}
        onClick={() => {
          setSelectedJob(job);
          setJobWindowOpen(true);
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.25,
            pl: 1.5,
            pr: 1.5,
          }}
        >
          <Avatar
            src={
              job.logo ? `${BASE_URL}/static/thumbnails/${job.logo}` : undefined
            }
            sx={{ width: 42, height: 42, flexShrink: 0 }}
          >
            {!job.logo && <BusinessIcon sx={{ fontSize: 20 }} />}
          </Avatar>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              mx: 1.25,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.3,
              }}
            >
              {job.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.4,
                flexWrap: "nowrap",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexShrink: 1,
                  minWidth: 0,
                  fontWeight: 500,
                }}
              >
                {job.company}
              </Typography>

              {job.work_mode && (
                <Chip
                  label={job.work_mode}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    flexShrink: 0,
                    "& .MuiChip-label": { px: 0.6 },
                  }}
                />
              )}

              {deadlineInfo && (
                <Chip
                  label={deadlineInfo.label}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 16,
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color: deadlineInfo.color,
                    borderColor: deadlineInfo.color,
                    flexShrink: 0,
                    "& .MuiChip-label": { px: 0.6 },
                  }}
                />
              )}
            </Box>
          </Box>

          <Box
            sx={(theme) => ({
              width: "5px",
              height: "50%",
              borderRadius: "999px",
              flexShrink: 0,
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
