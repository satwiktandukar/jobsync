import {
  Alert,
  Box,
  Button,
  Container,
  Modal,
  Snackbar,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useState } from "react";
import type { Job, JobCreate } from "../types/Job";
import { sectionToStatus, type SectionName } from "../utils/jobStatus";
import {
  create_application,
  upload_logo_image,
} from "../services/application_service";

type JobFormProps = {
  open: boolean;
  addJob: (job: Job) => void;
  close: () => void;
  jobSection: SectionName;
  category: string;
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
      category: category,
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

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Only PNG, JPEG, and GIF images are allowed",
        severity: "error",
      });
      return;
    }

    const logo_url = await upload_logo_image(file);

    setData((prev) => ({
      ...prev,
      logo: logo_url,
    }));
  };

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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ borderRadius: "20px" }}
              >
                Upload Logo
                <VisuallyHiddenInput
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={uploadImage}
                />
              </Button>

              {data.logo && (
                <>
                  <Typography variant="body2" color="success.light">
                    Upload successful
                  </Typography>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        logo: "",
                      }))
                    }
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>
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
