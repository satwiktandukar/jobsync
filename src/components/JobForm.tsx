import {
  Alert,
  Box,
  Button,
  Container,
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
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
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

  function handleClose() {
    resetForm();
    close();
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    };

    try {
      const createdJob = await create_application(job);

      addJob(createdJob);
      resetForm();
      close();

      setSnackbar({
        open: true,
        message: "New job created successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Failed to create job.",
        severity: "error",
      });
    }
  }

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Only PNG, JPEG, and GIF images are allowed.",
        severity: "error",
      });

      return;
    }

    try {
      const logo_url = await upload_logo_image(file);

      setData((prev) => ({
        ...prev,
        logo: logo_url,
      }));

      setSnackbar({
        open: true,
        message: "Logo uploaded successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: "Failed to upload logo.",
        severity: "error",
      });
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
          maxWidth="sm"
          sx={{
            minHeight: "80dvh",
            maxHeight: "100dvh",

            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "auto",
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
                  Add job
                </Typography>

                <Typography
                  sx={{
                    mt: 0.75,
                    color: "text.secondary",
                    fontSize: "0.95rem",
                  }}
                >
                  Create a new job in {jobSection}
                  {category ? ` under ${category.title}.` : "."}
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
                    name="description"
                    label="Description"
                    value={data.description}
                    onChange={handleChange}
                    sx={textFieldSx}
                    fullWidth
                    multiline
                    rows={2}
                  />

                  <Box
                    sx={(theme) => ({
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
                        textTransform: "none",
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
                        <Typography
                          variant="body2"
                          sx={{
                            flex: 1,
                            color: "success.main",
                            fontWeight: 600,
                          }}
                        >
                          Upload successful
                        </Typography>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() =>
                            setData((prev) => ({
                              ...prev,
                              logo: "",
                            }))
                          }
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                          }}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          color: "text.secondary",
                        }}
                      >
                        PNG, JPEG, or GIF only.
                      </Typography>
                    )}
                  </Box>

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
