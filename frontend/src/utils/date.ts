export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
  });
}

export function formatDateWithYear(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Stockholm",
  });
}

export function formatTime(time: string) {
  return time.slice(0, 5);
}

/**
 * Checks if a job date has passed by comparing it to today's date.
 * @param jobDate - The job date string to check.
 * @returns True if the job date is in the past, false otherwise.
 */
export function hasJobDatePassed(jobDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(jobDate);
  date.setHours(0, 0, 0, 0);
  return date < today;
}
