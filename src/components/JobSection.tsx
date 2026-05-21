import { Card, Box, Typography, Button } from "@mui/material";
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
  const { ref } = useDroppable({
    id: title,
  });

  return (
    <Card
      ref={ref}
      sx={(theme) => {
        return {
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.grey[200],
          height: "calc(100% - 70px)",
          width: "300px",

          margin: "70px 0px 0px 0px",

          borderRadius: "20px",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "300px",
          flexShrink: 0,
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
        };
      }}
    >
      <Box
        width={"100%"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "30px",
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          ml: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          pb: "10px",
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Button
          variant="contained"
          color="success"
          sx={{ mt: "5px", borderRadius: 12 }}
          onClick={() => {
            setAddFormShow(true);
            setSection(title);
            console.log("section: ", title);
          }}
        >
          + Add{" "}
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          px: "10px",
          pb: "20px",
          mt: "10px",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          gap: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {jobs.length === 0 ? (
          <Typography
            variant="body1"
            sx={{
              opacity: 0.6,
              textAlign: "center",
              mt: 4,
            }}
          >
            {EMPTY_SECTION_MESSAGES[title]}
          </Typography>
        ) : (
          <>
            {jobs.map((job) => (
              <JobCard
                key={job.id ?? `${job.title}-${job.company}`}
                job={job}
                setSelectedJob={setSelectedJob}
                setJobWindowOpen={setJobWindowOpen}
                currentSection={title}
              />
            ))}{" "}
          </>
        )}
      </Box>
    </Card>
  );
}
