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

export function getJobStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Aktiv";
    case "filled":
      return "Tillsatt";
    case "closed":
      return "Avslutad";
    default:
      return status;
  }
}

export function getRoleLabel(role: string): string {
  switch (role) {
    case "waiter":
      return "Servitör";
    case "chef":
      return "Kock";
    case "bartender":
      return "Bartender";
    case "dishwasher":
      return "Diskare";
    case "runner":
      return "Runner";
    default:
      return role;
  }
}

export function formatCompensation(amount: number): string {
  return Number(amount) % 1 === 0
    ? `${Number(amount).toFixed(0)} kr/h`
    : `${Number(amount).toFixed(2)} kr/h`;
}
