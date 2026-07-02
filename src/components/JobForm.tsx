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
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useState } from "react";

import type { Job, JobCreate, Category } from "../types/Job";
import { sectionToStatus, type SectionName } from "../utils/jobStatus";
import { EMPLOYMENT_TYPES, SOURCES, WORK_MODES } from "../utils/jobOptions";
import {
  create_application,
  upload_logo_image,
} from "../services/application_service";

type JobFormProps = {
  open: boolean;
  addJob: (job: Job) => void;
  close: () => void;
  jobSection: SectionName;
  category: Category | null;
};

const emptyForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  description: "",
  logo: "",
  job_url: "",
  employment_type: "",
  work_mode: "",
  source: "",
  deadline: "",
  applied_date: "",
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function JobForm({
  open,
  addJob,
  close,
  jobSection,
  category,
}: JobFormProps) {
  const [data, setData] = useState(emptyForm);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  function handleSnackbarClose() {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }

  function handleClose() {
    resetForm();
    close();
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const resetForm = () => setData(emptyForm);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const salary = data.salary.trim() ? Number.parseInt(data.salary, 10) : null;

    const job: JobCreate = {
      title: data.title,
      company: data.company,
      location: data.location,
      salary: Number.isNaN(salary) ? null : salary,
      description: data.description.trim() || null,
      category_id: category?.id ?? null,
      logo: data.logo.trim() || null,
      status: sectionToStatus[jobSection],
      job_url: data.job_url.trim() || null,
      employment_type: data.employment_type.trim() || null,
      work_mode: data.work_mode.trim() || null,
      source: data.source.trim() || null,
      deadline: data.deadline.trim() || null,
      applied_date: data.applied_date.trim() || null,
    };

    try {
      const createdJob = await create_application(job);
      addJob(createdJob);
      resetForm();
      close();
      setSnackbar({ open: true, message: "New job created successfully.", severity: "success" });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Failed to create job.", severity: "error" });
    }
  }

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({ open: true, message: "Only PNG, JPEG, and GIF images are allowed.", severity: "error" });
      return;
    }

    try {
      const logo_url = await upload_logo_image(file);
      setData((prev) => ({ ...prev, logo: logo_url }));
      setSnackbar({ open: true, message: "Logo uploaded successfully.", severity: "success" });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Failed to upload logo.", severity: "error" });
    }
  };

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
            overflowX: "auto",
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
                  Add job
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: "0.95rem" }}>
                  Create a new job in {jobSection}
                  {category ? ` under ${category.title}.` : "."}
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
                  />

                  <TextField
                    name="company"
                    label="Company"
                    value={data.company}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                  />

                  <TextField
                    name="location"
                    label="Location"
                    value={data.location}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    required
                  />

                  <TextField
                    name="salary"
                    label="Salary"
                    type="number"
                    value={data.salary}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                  />

                  <TextField
                    name="job_url"
                    label="Job URL"
                    value={data.job_url}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                  />

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

                  <TextField
                    name="deadline"
                    label="Deadline"
                    type="date"
                    value={data.deadline}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  {jobSection !== "Wish List" ? (
                    <TextField
                      name="applied_date"
                      label="Applied date"
                      type="date"
                      value={data.applied_date}
                      onChange={handleChange}
                      sx={textFieldSx}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
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
                  />

                  {/* Logo upload */}
                  <Box
                    sx={(theme) => ({
                      gridColumn: { xs: "auto", sm: "1 / -1" },
                      display: "flex",
                      alignItems: { xs: "stretch", sm: "center" },
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1.5,
                      p: 2,
                      borderRadius: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.42)",
                      border: "1px solid rgba(255, 255, 255, 0.45)",
                      ...theme.applyStyles("dark", {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }),
                    })}
                  >
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        borderRadius: "10px",
                        fontWeight: 700,
                        borderColor: "hsl(265, 79%, 52%)",
                        color: "hsl(265, 79%, 52%)",
                        "&:hover": {
                          borderColor: "hsl(265, 75%, 45%)",
                          backgroundColor: "rgba(126, 34, 206, 0.08)",
                        },
                      }}
                    >
                      Upload logo
                      <VisuallyHiddenInput
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={uploadImage}
                      />
                    </Button>

                    {data.logo ? (
                      <>
                        <Typography variant="body2" sx={{ flex: 1, color: "success.main", fontWeight: 600 }}>
                          Upload successful
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => setData((prev) => ({ ...prev, logo: "" }))}
                          sx={{ borderRadius: "10px", fontWeight: 700 }}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Typography variant="body2" sx={{ flex: 1, color: "text.secondary" }}>
                        PNG, JPEG, or GIF only.
                      </Typography>
                    )}
                  </Box>

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
                      backgroundColor: "hsl(265, 79%, 52%)",
                      boxShadow: "0 10px 28px rgba(126, 34, 206, 0.28)",
                      "&:hover": {
                        backgroundColor: "hsl(265, 75%, 45%)",
                        boxShadow: "0 12px 32px rgba(126, 34, 206, 0.34)",
                      },
                    }}
                  >
                    Add job
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
