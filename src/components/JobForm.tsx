import {
  Alert,
  Box,
  Button,
  Container,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Job, JobCreate } from "../types/Job";
import { sectionToStatus, type SectionName } from "../utils/jobStatus";
import { create_application } from "../services/application_service";

type JobFormProps = {
  open: boolean;
  addJob: (job: Job) => void;
  close: () => void;
  jobSection: SectionName;
};

const emptyForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  description: "",
  category: "",
  logo: "",
};

const fieldSx = {
  input: { color: "white" },
  label: { color: "white" },
  paddingBottom: "10px",
};

export default function JobForm({
  open,
  addJob,
  close,
  jobSection,
}: JobFormProps) {
  const [data, setData] = useState(emptyForm);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => setData(emptyForm);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const salary = data.salary.trim() ? Number.parseInt(data.salary, 10) : null;

    const job: JobCreate = {
      title: data.title,
      company: data.company,
      location: data.location,
      salary: Number.isNaN(salary) ? null : salary,
      description: data.description.trim() || null,
      category: data.category.trim() || null,
      logo: data.logo.trim() || null,
      status: sectionToStatus[jobSection],
    };

    try {
      const createdJob = await create_application(job);

      addJob(createdJob);
      resetForm();
      close();

      setSnackbar({
        open: true,
        message: "New job created successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Failed to create job",
        severity: "error",
      });
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.83)",
            },
          },
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            color: "white",
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" id="modal-modal-title">
              Job Form
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              name="title"
              label="Job Title"
              value={data.title}
              onChange={handleChange}
              sx={fieldSx}
              fullWidth
              required
            />

            <TextField
              name="company"
              label="Company"
              value={data.company}
              onChange={handleChange}
              sx={fieldSx}
              fullWidth
              required
            />

            <TextField
              name="location"
              label="Location"
              value={data.location}
              onChange={handleChange}
              sx={fieldSx}
              fullWidth
              required
            />

            <TextField
              name="salary"
              label="Salary"
              type="number"
              value={data.salary}
              onChange={handleChange}
              sx={fieldSx}
              fullWidth
            />

            <TextField
              name="description"
              label="Description"
              value={data.description}
              onChange={handleChange}
              sx={fieldSx}
              fullWidth
              multiline
              rows={4}
            />

            <TextField
              name="category"
              label="Category"
              value={data.category}
              onChange={handleChange}
              sx={fieldSx}
              fullWidth
            />

            <TextField
              name="logo"
              label="Logo URL"
              value={data.logo}
              onChange={handleChange}
              sx={fieldSx}
              fullWidth
            />

            <Box sx={{ padding: "20px" }}>
              <Button
                variant="contained"
                type="submit"
                color="success"
                sx={{ borderRadius: "20px" }}
                fullWidth
              >
                Add
              </Button>
            </Box>
          </form>
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
