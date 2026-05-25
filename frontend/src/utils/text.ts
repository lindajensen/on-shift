export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((word) => /^[a-zA-ZåäöÅÄÖ]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}
