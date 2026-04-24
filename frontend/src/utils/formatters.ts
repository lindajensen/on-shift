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
