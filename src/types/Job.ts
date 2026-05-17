export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interviewing"
  | "offers"
  | "rejected"
  | "archived";

export type Job = {
  id: number ;
  title: string;
  company: string;
  location: string;
  salary: number | null;
  description: string | null;
  category: string | null;
  logo: string | null;
  status: ApplicationStatus;
};

export type JobCreate = Omit<Job, "id">;

export type JobUpdate = Partial<Job>;

export type Category = {
  id: string;
};
