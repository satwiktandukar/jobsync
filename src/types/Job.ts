export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interviewing"
  | "offers"
  | "rejected"
  | "archived";

export type Job = {
  id: number;

  title: string;
  company: string;
  location: string;

  salary: number | null;
  description: string | null;

  category_id: number | null;

  logo: string | null;

  status: ApplicationStatus;
};

export type JobCreate = Omit<Job, "id">;

export type JobUpdate = Partial<Job>;

export type Category = {
  id: number;
  title: string;
};

export type UserCreate = {
  username: string;
  name: string;
  password: string;
  email: string;
};

export type User = Omit<UserCreate, "password">;

// export type UserLogin = Omit<UserCreate, "email" & "name">;

export type Token = {
  access_token: string;
  token_type: string;
};
