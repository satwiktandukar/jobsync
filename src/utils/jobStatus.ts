import type { ApplicationStatus } from "../types/Job";

export type SectionName =
  | "Wish List"
  | "Applied"
  | "Interviewing"
  | "Offers"
  | "Rejected"
  | "Archived";


export const SECTIONS: SectionName[] = [
  "Wish List",
  "Applied",
  "Interviewing",
  "Offers",
  "Rejected",
  "Archived",
];

export const sectionToStatus: Record<SectionName, ApplicationStatus> = {
  "Wish List": "wishlist",
  Applied: "applied",
  Interviewing: "interviewing",
  Offers: "offers",
  Rejected: "rejected",
  Archived: "archived",
};

export const statusToSection: Record<ApplicationStatus, SectionName> = {
  wishlist: "Wish List",
  applied: "Applied",
  interviewing: "Interviewing",
  offers: "Offers",
  rejected: "Rejected",
  archived: "Archived",
};
