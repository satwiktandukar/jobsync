import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Modal,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { Category, Job, JobUpdate } from "../types/Job";
import { update_application } from "../services/application_service";

type JobWindowProps = {
  open: boolean;
  onClose: () => void;
  job: Job;
  onJobUpdated: (job: Job) => void;
  categories: Category[];
};

function jobToForm(job: Job) {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary?.toString() ?? "",
    description: job.description ?? "",
    category_id: job.category_id?.toString() ?? "",
    logo: job.logo ?? "",
  };
}

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
};

export default function JobWindow({
  open,
  onClose,
  job,
  onJobUpdated,
  categories,
}: JobWindowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(() => jobToForm(job));

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  function handleSnackbarClose() {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }

  useEffect(() => {
    setData(jobToForm(job));
    setIsEditing(false);
  }, [job]);

  function handleClose() {
    setIsEditing(false);
    setData(jobToForm(job));
    onClose();
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const salary = data.salary.trim() ? Number.parseInt(data.salary, 10) : null;

    const patch: JobUpdate = {
      title: data.title,
      company: data.company,
      location: data.location,
      salary: Number.isNaN(salary) ? null : salary,
      description: data.description.trim() || null,
      category_id: data.category_id === "" ? null : Number(data.category_id),
      logo: data.logo.trim() || null,
    };

    try {
      const updated = await update_application(job.id, patch);

      onJobUpdated(updated);

      setSnackbar({
        open: true,
        message: "Job saved successfully.",
        severity: "success",
      });

      handleClose();
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Failed to save job.",
        severity: "error",
      });
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(4, 6, 18, 0.72)",
              backdropFilter: "blur(8px)",
            },
          },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            minHeight: "80dvh",
            maxHeight: "100dvh",

            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            boxSizing: "border-box",

            scrollbarWidth: "none",

            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Paper
            elevation={0}
            sx={(theme) => ({
              width: "100%",
              p: { xs: 2.5, sm: 4 },
              borderRadius: "24px",

              backgroundColor: "rgba(255, 255, 255, 0.72)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 24px 80px rgba(36, 28, 95, 0.24)",

              ...theme.applyStyles("dark", {
                backgroundColor: "rgba(17, 15, 35, 0.86)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 24px 80px rgba(0, 0, 0, 0.42)",
              }),
            })}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  component="h2"
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "text.primary",
                  }}
                >
                  Job details
                </Typography>

                <Typography
                  sx={{
                    mt: 0.75,
                    color: "text.secondary",
                    fontSize: "0.95rem",
                  }}
                >
                  {isEditing
                    ? "Update the details for this job application."
                    : "View the saved details for this job application."}
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={1.2}>
                  <TextField
                    name="title"
                    label="Job title"
                    value={data.title}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    disabled={!isEditing}
                  />

                  <TextField
                    name="company"
                    label="Company"
                    value={data.company}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    disabled={!isEditing}
                  />

                  <TextField
                    name="location"
                    label="Location"
                    value={data.location}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    disabled={!isEditing}
                  />

                  <TextField
                    name="salary"
                    label="Salary"
                    type="number"
                    value={data.salary}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    disabled={!isEditing}
                  />

                  <TextField
                    name="description"
                    label="Description"
                    value={data.description}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    multiline
                    rows={2}
                    disabled={!isEditing}
                  />

                  <TextField
                    select
                    fullWidth
                    name="category_id"
                    label="Category"
                    value={data.category_id}
                    onChange={handleChange}
                    sx={textFieldSx}
                    disabled={!isEditing}
                  >
                    <MenuItem value="">No category</MenuItem>

                    {categories.map((category) => (
                      <MenuItem key={category.id} value={String(category.id)}>
                        {category.title}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      mt: 1,
                      py: 1.2,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1rem",

                      backgroundColor: isEditing
                        ? "success.main"
                        : "hsl(265, 79%, 52%)",
                      boxShadow: isEditing
                        ? "0 10px 28px rgba(46, 125, 50, 0.28)"
                        : "0 10px 28px rgba(126, 34, 206, 0.28)",

                      "&:hover": {
                        backgroundColor: isEditing
                          ? "success.dark"
                          : "hsl(265, 75%, 45%)",
                        boxShadow: isEditing
                          ? "0 12px 32px rgba(46, 125, 50, 0.34)"
                          : "0 12px 32px rgba(126, 34, 206, 0.34)",
                      },
                    }}
                  >
                    {isEditing ? "Save changes" : "Edit job"}
                  </Button>

                  <Button
                    type="button"
                    fullWidth
                    variant="text"
                    onClick={handleClose}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
