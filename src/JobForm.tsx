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
    <Modal open={open} onClose={close}>
      <div>
        <h2>Job Form</h2>
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            addJob(data);
            close();
          }}
        >
          <label>
            Company:
            <input
              type="text"
              name="company"
              value={data.company}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Role:
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
          />

          <br />
          <label>
            salary:
            <input
              type="number"
              name="salary"
              value={data.salary}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Notes:
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
            ></textarea>
          </label>
          <br />
          <label></label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </Modal>
  );
}
