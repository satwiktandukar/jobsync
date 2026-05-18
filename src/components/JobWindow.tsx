import {
  Alert,
  Box,
  Button,
  Container,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Job, JobUpdate } from "../types/Job";
import { update_application } from "../services/application_service";
import TextFieldJob from "./TextfieldJob";

type JobWindowProps = {
  open: boolean;
  onClose: () => void;
  job: Job;
  onJobUpdated: (job: Job) => void;
};

function jobToForm(job: Job) {
  return {
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary?.toString() ?? "",
    description: job.description ?? "",
    category: job.category ?? "",
    logo: job.logo ?? "",
  };
}

export default function JobWindow({
  open,
  onClose,
  job,
  onJobUpdated,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
      category: data.category.trim() || null,
      logo: data.logo.trim() || null,
    };

    try {
      const updated = await update_application(job.id, patch);
      onJobUpdated(updated);

      setSnackbar({
        open: true,
        message: "Job saved successfully",
        severity: "success",
      });

      handleClose();
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Failed to save job",
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
              Job Details
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextFieldJob
              name="title"
              label="Title"
              value={data.title}
              required
              handleChange={handleChange}
              isEditing={isEditing}
            />

            <TextFieldJob
              name="company"
              label="Company"
              value={data.company}
              required
              handleChange={handleChange}
              isEditing={isEditing}
            />

            <TextFieldJob
              name="location"
              label="Location"
              value={data.location}
              required
              handleChange={handleChange}
              isEditing={isEditing}
            />

            <TextFieldJob
              name="salary"
              label="Salary"
              value={data.salary}
              type="number"
              handleChange={handleChange}
              isEditing={isEditing}
            />

            <TextFieldJob
              name="description"
              label="Description"
              value={data.description}
              multiline
              rows={4}
              handleChange={handleChange}
              isEditing={isEditing}
            />

            <TextFieldJob
              name="category"
              label="Category"
              value={data.category}
              handleChange={handleChange}
              isEditing={isEditing}
            />

            <TextFieldJob
              name="logo"
              label="Logo URL"
              value={data.logo}
              handleChange={handleChange}
              isEditing={isEditing}
            />

            <Box sx={{ padding: "20px" }}>
              <Button
                variant="contained"
                type="submit"
                color={isEditing ? "success" : "info"}
                sx={{ borderRadius: "20px" }}
                fullWidth
              >
                {isEditing ? "Save" : "Edit"}
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
