import {
  Box,
  Button,
  Container,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Job, JobUpdate } from "../types/Job";
import { update_application } from "../services/application_service";

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

const fieldSx = {
  input: { color: "white" },
  label: { color: "white" },
  paddingBottom: "10px",
};

export default function JobWindow({
  open,
  onClose,
  job,
  onJobUpdated,
}: JobWindowProps) {
  const [data, setData] = useState(() => jobToForm(job));

  useEffect(() => {
    setData(jobToForm(job));
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
        <form
          onSubmit={async (e: React.FormEvent) => {
            e.preventDefault();

            const salary = data.salary.trim()
              ? Number.parseInt(data.salary, 10)
              : null;

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
              onClose();
            } catch (error) {
              console.error(error);
            }
          }}
        >
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
              Save
            </Button>
          </Box>
        </form>
      </Container>
    </Modal>
  );
}
