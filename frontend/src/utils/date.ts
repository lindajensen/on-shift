export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    // year: "numeric",
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

export function hasJobDatePassed(jobDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(jobDate);
  date.setHours(0, 0, 0, 0);
  return date < today;
}
