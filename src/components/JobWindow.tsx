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
    job_url: job.job_url ?? "",
    employment_type: job.employment_type ?? "",
    work_mode: job.work_mode ?? "",
    source: job.source ?? "",
    deadline: job.deadline ?? "",
    applied_date: job.applied_date ?? "",
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
      job_url: data.job_url.trim() || null,
      employment_type: data.employment_type.trim() || null,
      work_mode: data.work_mode.trim() || null,
      source: data.source.trim() || null,
      deadline: data.deadline.trim() || null,
      applied_date: data.applied_date.trim() || null,
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
          maxWidth="md"
          sx={{
            minHeight: "80dvh",
            maxHeight: "100dvh",

            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: { xs: "flex-start", sm: "center" },

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
            <Stack spacing={2}>
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
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.2,
                  }}
                >
                  <TextField
                    name="title"
                    label="Job title"
                    value={data.title}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    name="company"
                    label="Company"
                    value={data.company}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    name="location"
                    label="Location"
                    value={data.location}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    name="salary"
                    label="Salary"
                    type="number"
                    value={data.salary}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    name="job_url"
                    label="Job URL"
                    value={data.job_url}
                    onChange={handleChange}
                    sx={{
                      ...textFieldSx,
                      cursor:
                        !isEditing && data.job_url ? "pointer" : "default",
                      "& .MuiInputBase-input": {
                        cursor:
                          !isEditing && data.job_url ? "pointer" : "default",
                      },
                    }}
                    fullWidth
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                    onClick={() => {
                      if (!isEditing && data.job_url) {
                        window.open(
                          data.job_url,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }
                    }}
                  />

                  <TextField
                    name="source"
                    label="Source"
                    value={data.source}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    name="employment_type"
                    label="Employment type"
                    value={data.employment_type}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    name="work_mode"
                    label="Work mode"
                    value={data.work_mode}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    name="deadline"
                    label="Deadline"
                    type="date"
                    value={data.deadline}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  {job.status !== "wishlist" ? (
                    <TextField
                      name="applied_date"
                      label="Applied date"
                      type="date"
                      value={data.applied_date}
                      onChange={handleChange}
                      sx={textFieldSx}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                    />
                  ) : null}

                  <TextField
                    name="description"
                    label="Description"
                    value={data.description}
                    onChange={handleChange}
                    sx={{
                      ...textFieldSx,
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                    }}
                    fullWidth
                    multiline
                    rows={2}
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />

                  <TextField
                    select
                    fullWidth
                    name="category_id"
                    label="Category"
                    value={data.category_id}
                    onChange={handleChange}
                    sx={{
                      ...textFieldSx,
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                    }}
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
                      gridColumn: { xs: "auto", sm: "1 / -1" },
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
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
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
