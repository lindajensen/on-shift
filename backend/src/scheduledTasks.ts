import pool from "../src/db";

export async function closeExpiredJobs(): Promise<void> {
  try {
    await pool.query(
      `UPDATE job SET status = 'closed' WHERE job_date < CURRENT_DATE AND status = 'active'`,
    );
    console.log("Expired jobs closed successfully");
  } catch (error) {
    console.error("Could not close expired jobs", error);
  }
}
