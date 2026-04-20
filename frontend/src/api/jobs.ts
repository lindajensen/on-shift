import { mockJobs } from "../data/mockJobs";

export async function getAllJobs() {
  return mockJobs;
}

export async function getJobById(id: string) {
  const job = mockJobs.find((job) => job.id === Number(id));

  if (!job) throw new Error("Inget jobb hittades");

  return job;
}
