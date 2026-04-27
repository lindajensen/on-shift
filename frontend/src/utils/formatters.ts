export function getStatusLabel(status: string): string {
  switch (status) {
    case "hired":
      return "Anställd";
    case "pending":
      return "Väntar";
    case "rejected":
      return "Nekad";
    default:
      return status;
  }
}

export function getExperienceLevel(experience_level: string): string {
  switch (experience_level) {
    case "beginner":
      return "Nybörjare";
    case "junior":
      return "Junior";
    case "experienced":
      return "Erfaren";
    case "senior":
      return "Senior";
    default:
      return experience_level;
  }
}
