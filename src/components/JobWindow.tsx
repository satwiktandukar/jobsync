import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Modal,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";

import type { Category, Job, JobUpdate } from "../types/Job";
import type { ApplicationStatus } from "../types/Job";
import {
  delete_application,
  update_application,
} from "../services/application_service";
import { EMPLOYMENT_TYPES, SOURCES, WORK_MODES } from "../utils/jobOptions";

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "wishlist", label: "Wish List", color: "#7c5cff" },
  { value: "applied", label: "Applied", color: "#3b82f6" },
  { value: "interviewing", label: "Interviewing", color: "#f59e0b" },
  { value: "offers", label: "Offers", color: "#10b981" },
  { value: "rejected", label: "Rejected", color: "#ef4444" },
  { value: "archived", label: "Archived", color: "#6b7280" },
];

type JobWindowProps = {
  open: boolean;
  onClose: () => void;
  job: Job;
  onJobUpdated: (job: Job) => void;
  onJobDeleted: (id: number) => void;
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
    status: job.status,
  };
}

const textFieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
};

export default function JobWindow({
  open,
  onClose,
  job,
  onJobUpdated,
  onJobDeleted,
  categories,
}: JobWindowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(() => jobToForm(job));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  function handleSnackbarClose() {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
    setData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleStatusChange(newStatus: ApplicationStatus) {
    if (newStatus === job.status) return;
    try {
      const updated = await update_application(job.id, { status: newStatus });
      onJobUpdated(updated);
      setSnackbar({ open: true, message: "Status updated.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to update status.", severity: "error" });
    }
  }

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
      status: data.status,
    };

    try {
      const updated = await update_application(job.id, patch);
      onJobUpdated(updated);
      setSnackbar({ open: true, message: "Job saved successfully.", severity: "success" });
      handleClose();
    } catch {
      setSnackbar({ open: true, message: "Failed to save job.", severity: "error" });
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await delete_application(job.id);
      setDeleteDialogOpen(false);
      onClose();
      onJobDeleted(job.id);
    } catch {
      setSnackbar({ open: true, message: "Failed to delete job.", severity: "error" });
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
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
            "&::-webkit-scrollbar": { display: "none" },
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
                  sx={{ fontWeight: 700, letterSpacing: "-0.03em", color: "text.primary" }}
                >
                  Job details
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: "0.95rem" }}>
                  {isEditing
                    ? "Update the details for this job application."
                    : "View the saved details for this job application."}
                </Typography>
              </Box>

              {/* Quick status chips — visible in view mode only */}
              {!isEditing && (
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {STATUS_OPTIONS.map(({ value, label, color }) => (
                    <Chip
                      key={value}
                      label={label}
                      size="small"
                      onClick={() => handleStatusChange(value)}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        height: 26,
                        transition: "all 0.15s ease",
                        ...(job.status === value
                          ? {
                              backgroundColor: color,
                              color: "#fff",
                              boxShadow: `0 4px 12px ${color}55`,
                            }
                          : {
                              backgroundColor: "transparent",
                              border: `1px solid ${color}66`,
                              color,
                              "&:hover": {
                                backgroundColor: `${color}18`,
                              },
                            }),
                      }}
                    />
                  ))}
                </Box>
              )}

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
                    InputProps={{ readOnly: !isEditing }}
                  />

                  <TextField
                    name="company"
                    label="Company"
                    value={data.company}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    InputProps={{ readOnly: !isEditing }}
                  />

                  <TextField
                    name="location"
                    label="Location"
                    value={data.location}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                    InputProps={{ readOnly: !isEditing }}
                  />

                  <TextField
                    name="salary"
                    label="Salary"
                    type="number"
                    value={data.salary}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputProps={{ readOnly: !isEditing }}
                  />

                  <TextField
                    name="job_url"
                    label="Job URL"
                    value={data.job_url}
                    onChange={handleChange}
                    sx={{
                      ...textFieldSx,
                      cursor: !isEditing && data.job_url ? "pointer" : "default",
                      "& .MuiInputBase-input": {
                        cursor: !isEditing && data.job_url ? "pointer" : "default",
                      },
                    }}
                    fullWidth
                    InputProps={{ readOnly: !isEditing }}
                    onClick={() => {
                      if (!isEditing && data.job_url) {
                        window.open(data.job_url, "_blank", "noopener,noreferrer");
                      }
                    }}
                  />

                  {isEditing ? (
                    <TextField
                      select
                      name="source"
                      label="Source"
                      value={data.source}
                      onChange={handleChange}
                      sx={textFieldSx}
                      fullWidth
                    >
                      <MenuItem value="">None</MenuItem>
                      {SOURCES.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      name="source"
                      label="Source"
                      value={data.source}
                      sx={textFieldSx}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  )}

                  {isEditing ? (
                    <TextField
                      select
                      name="employment_type"
                      label="Employment type"
                      value={data.employment_type}
                      onChange={handleChange}
                      sx={textFieldSx}
                      fullWidth
                    >
                      <MenuItem value="">None</MenuItem>
                      {EMPLOYMENT_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      name="employment_type"
                      label="Employment type"
                      value={data.employment_type}
                      sx={textFieldSx}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  )}

                  {isEditing ? (
                    <TextField
                      select
                      name="work_mode"
                      label="Work mode"
                      value={data.work_mode}
                      onChange={handleChange}
                      sx={textFieldSx}
                      fullWidth
                    >
                      <MenuItem value="">None</MenuItem>
                      {WORK_MODES.map((m) => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      name="work_mode"
                      label="Work mode"
                      value={data.work_mode}
                      sx={textFieldSx}
                      fullWidth
                      InputProps={{ readOnly: true }}
                    />
                  )}

                  <TextField
                    name="deadline"
                    label="Deadline"
                    type="date"
                    value={data.deadline}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputProps={{ readOnly: !isEditing }}
                    InputLabelProps={{ shrink: true }}
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
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ readOnly: !isEditing }}
                    />
                  ) : null}

                  {isEditing && (
                    <TextField
                      select
                      name="status"
                      label="Status"
                      value={data.status}
                      onChange={handleChange}
                      sx={textFieldSx}
                      fullWidth
                    >
                      {STATUS_OPTIONS.map(({ value, label }) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                      ))}
                    </TextField>
                  )}

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
                    InputProps={{ readOnly: !isEditing }}
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
                      fontWeight: 700,
                      fontSize: "1rem",
                      backgroundColor: isEditing ? "success.main" : "hsl(265, 79%, 52%)",
                      boxShadow: isEditing
                        ? "0 10px 28px rgba(46, 125, 50, 0.28)"
                        : "0 10px 28px rgba(126, 34, 206, 0.28)",
                      "&:hover": {
                        backgroundColor: isEditing ? "success.dark" : "hsl(265, 75%, 45%)",
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
                      fontWeight: 600,
                      color: "text.secondary",
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  >
                    Delete job
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Modal>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          backdrop: { sx: { backdropFilter: "blur(4px)" } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete job?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete <strong>{job.title}</strong> at{" "}
            <strong>{job.company}</strong>. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="text">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ borderRadius: "10px", fontWeight: 700 }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
