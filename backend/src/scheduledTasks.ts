import pool from "../src/db";

export async function closeExpiredJobs(): Promise<void> {
  try {
    await pool.query(
      `UPDATE job SET status = 'closed', was_filled = TRUE WHERE job_date < CURRENT_DATE AND status = 'filled'`,
    );

    await pool.query(
      `UPDATE job SET status = 'closed' WHERE job_date < CURRENT_DATE AND status = 'active'`,
    );

    await pool.query(
      `UPDATE application SET status = 'rejected' WHERE status = 'pending' AND job_id IN (SELECT id FROM job WHERE job_date < CURRENT_DATE)`,
    );
    console.log("Expired jobs closed successfully");
  } catch (error) {
    console.error("Could not close expired jobs", error);
  }
}
