export type Application = {
  id: number;
  company: string;
  role: string;
  application_status: string;
  priority: number;
  notes?: string | null;
};

export const fetch_applications = async (): Promise<Application[]> => {
  const response = await fetch("http://127.0.0.1:8000/applications");

  if (!response.ok) {
    throw new Error("failed to fetch applications");
  }

  const data = await response.json();
  return data.applications;
};
