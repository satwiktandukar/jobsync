import { Card, Box, Typography, Button, Chip } from "@mui/material";
import { useDroppable } from "@dnd-kit/react";

import JobCard from "./JobCard";
import type { Job } from "../types/Job";
import type { SectionName } from "../utils/jobStatus";

const EMPTY_SECTION_MESSAGES = {
  "Wish List": "Save jobs you're interested in.",
  Applied: "Track submitted applications.",
  Interviewing: "Interview-stage jobs appear here.",
  Offers: "Offers will show up here.",
  Rejected: "Rejected jobs appear here.",
  Archived: "Archived jobs are stored here.",
} as const;

export default function JobSection({
  title,
  icon,
  jobs,
  setSelectedJob,
  setJobWindowOpen,
  setAddFormShow,
  setSection,
}: {
  title: SectionName;
  icon: React.ReactNode;
  jobs: Job[];
  setSelectedJob: (job: Job) => void;
  setJobWindowOpen: (open: boolean) => void;
  setAddFormShow: (open: boolean) => void;
  setSection: (section: SectionName) => void;
}) {
  const { ref } = useDroppable({ id: title });

  return (
    <Card
      ref={ref}
      sx={(theme) => ({
        height: "100%",
        width: "300px",
        minWidth: "300px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "20px",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.72)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(255,255,255,0.7)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 18px 40px rgba(0,0,0,0.28)"
            : "0 18px 40px rgba(30,40,60,0.10)",
        transition: "all 0.22s ease",
      })}
    >
      {/* Section header */}
      <Box
        sx={{
          width: "100%",
          pt: 2.5,
          pb: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.75,
          flexShrink: 0,
        }}
      >
        <Box sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}>
          {icon}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
            {title}
          </Typography>
          {jobs.length > 0 && (
            <Chip
              label={jobs.length}
              size="small"
              sx={{
                height: 20,
                minWidth: 20,
                fontSize: "0.72rem",
                fontWeight: 700,
                backgroundColor: "primary.main",
                color: "#fff",
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
        </Box>

        <Button
          variant="contained"
          color="success"
          size="small"
          sx={{ borderRadius: 12, px: 2, py: 0.4, fontSize: "0.8rem" }}
          onClick={() => {
            setAddFormShow(true);
            setSection(title);
          }}
        >
          + Add
        </Button>
      </Box>

      {/* Cards list */}
      <Box
        sx={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          px: "10px",
          pb: "20px",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          gap: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {jobs.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ opacity: 0.5, textAlign: "center", mt: 4, px: 1 }}
          >
            {EMPTY_SECTION_MESSAGES[title]}
          </Typography>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id ?? `${job.title}-${job.company}`}
              job={job}
              setSelectedJob={setSelectedJob}
              setJobWindowOpen={setJobWindowOpen}
              currentSection={title}
            />
          ))
        )}
      </Box>
    </Card>
  );
}
