import { Container, Modal, Typography } from "@mui/material";

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

type JobWindowProps = {
  open: boolean;
  onClose: () => void;
  job: Job | null;
};

export default function JobWindow({ open, onClose, job }: JobWindowProps) {
  return (
    <>
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {job && (
            <>
              <Typography variant="h2" component="h2">
                {job.title}
              </Typography>
              <Typography variant="h4" component="h3">
                {job.company}
              </Typography>
              <Typography variant="h6" component="p">
                {job.location}
              </Typography>
              <Typography variant="h6" component="p">
                {job.salary}
              </Typography>
              <Typography variant="h6" component="p">
                {job.description}
              </Typography>
              {/* You can also add the logo and category as needed */}
            </>
          )}
        </Container>
      </Modal>
    </>
  );
}
