export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    // year: "numeric",
  });
}

export function formatTime(time: string) {
  return time.slice(0, 5);
}
