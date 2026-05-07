import { Label } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  category: "IT" | "Cybersecurity" | "Other"; //more categoeries can be added as needed.
  logo: string; //perhaps I will have a directory of images user can upload to with the company logo.
};

type JobFormProps = {
  open: boolean;
  addJob: (job: Job) => void;
  close: () => void;
};

export default function JobForm({ open, addJob, close }: JobFormProps) {
  const [data, setData] = useState({
    id: 0,
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    category: "IT" as "IT" | "Cybersecurity" | "Other",
    logo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
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
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            addJob(data);
            close();
          }}
        >
          <TextField
            name="title"
            label="Job Title"
            onChange={handleChange}
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              paddingBottom: "10px",
            }}
            fullWidth
          />
          <TextField
            name="company"
            label="Company"
            onChange={handleChange}
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              paddingBottom: "10px",
            }}
            fullWidth
          />
          <TextField
            name="location"
            label="Location"
            onChange={handleChange}
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              paddingBottom: "10px",
            }}
            fullWidth
          />
          <TextField
            name="salary"
            label="Salary"
            onChange={handleChange}
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              paddingBottom: "10px",
            }}
            fullWidth
          />
          <TextField
            name="description"
            label="Description"
            onChange={handleChange}
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              paddingBottom: "10px",
            }}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            name="category"
            label="Category"
            onChange={handleChange}
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              paddingBottom: "10px",
            }}
            fullWidth
          />
          <TextField
            name="logo"
            label="Logo URL"
            onChange={handleChange}
            sx={{
              input: { color: "white" },
              label: { color: "white" },
              paddingBottom: "10px",
            }}
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
  );
}
