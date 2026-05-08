export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  category: "IT" | "Cybersecurity" | "Other"; //more categoeries can be added as needed.
  logo: string | null; //perhaps I will have a directory of images user can upload to with the company logo.
};
