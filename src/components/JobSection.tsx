import { Card, Box, Typography, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import JobCard from "./JobCard";
import type { Job } from "../types/Job";

export default function JobSection({
  title,
  icon,
  jobs,
  setSelectedJob,
  setJobWindowOpen,
  setAddFormShow,
}: {
  title: string;
  icon: React.ReactNode;
  jobs: Job[];
  setSelectedJob: (job: Job) => void;
  setJobWindowOpen: (open: boolean) => void;
  setAddFormShow: (open: boolean) => void;
}) {
  return (
    <Card
      sx={{
        height: "calc(100% - 70px)",
        width: "300px",

        margin: "70px 0px 0px 0px",

        backdropFilter: "blur(10px)",
        backgroundColor: "rgb(226, 226, 226)",
        borderRadius: "20px",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
          onClick={() => setAddFormShow(true)}
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
        {jobs.map((job) => (
          <JobCard
            job={job}
            setSelectedJob={setSelectedJob}
            setJobWindowOpen={setJobWindowOpen}
          />
        ))}
      </Box>
    </Card>
  );
}
