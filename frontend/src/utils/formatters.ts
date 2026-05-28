import { Availability } from "../types";

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
  if (!experience_level) return "Okänd nivå";

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
  if (!role) return "Okänt yrke";

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

/**
 * Determines the shift type based on start time and job date.
 * @param startTime - The start time.
 * @param jobDate - The job date string.
 * @returns "helg" for weekends, "kväll" for evenings (17:00+), "dag" for daytime.
 */

export function getShiftType(startTime: string, jobDate: string): string {
  const hour = parseInt(startTime.split(":")[0]);
  const day = new Date(jobDate).getDay();

  if (day === 0 || day === 6) return "helg";
  if (hour >= 17) return "kväll";
  return "dag";
}

/**
 * Formats a worker's availability into a readable string.
 * @param availability - Array of availability entries with day and time.
 * @returns A string like "Vardagar och helger · Dag och kväll".
 */
export function formatAvailability(availability: Availability[]): string {
  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const weekends = ["saturday", "sunday"];

  const hasWeekdays = availability.some((entry) =>
    weekdays.includes(entry.day_of_week),
  );
  const hasWeekends = availability.some((entry) =>
    weekends.includes(entry.day_of_week),
  );

  const isMorning = availability.some((entry) => entry.start_time < "12:00:00");
  const isEvening = availability.some(
    (entry) => entry.start_time >= "17:00:00",
  );
  const isDayTime = availability.some(
    (entry) => entry.start_time >= "12:00:00" && entry.start_time < "17:00:00",
  );

  const timeOfDay =
    isMorning && isEvening
      ? "Dag och kväll"
      : isMorning
        ? "Morgon"
        : isDayTime
          ? "Dag"
          : isEvening
            ? "Kväll"
            : "";

  const daysOfWeek =
    hasWeekdays && hasWeekends
      ? "Vardagar och helger"
      : hasWeekdays
        ? "Vardagar"
        : hasWeekends
          ? "Helger"
          : "";

  if (!daysOfWeek && !timeOfDay) return "Inga dagar eller tider angivna";

  return `${daysOfWeek} · ${timeOfDay}`;
}

export function formatAddress(
  street: string | null,
  postalCode: string | null,
  city: string | null,
): string {
  if (!street || !postalCode || !city) return "Ingen adress angiven";
  return `${street}, ${postalCode} ${city}`;
}

export function getDayLabel(day: string): string {
  switch (day) {
    case "monday":
      return "Mån";
    case "tuesday":
      return "Tis";
    case "wednesday":
      return "Ons";
    case "thursday":
      return "Tors";
    case "friday":
      return "Fre";
    case "saturday":
      return "Lör";
    case "sunday":
      return "Sön";
    default:
      return day;
  }
}

export function formatFilename(
  filename: string,
  maxLength: number = 30,
): string {
  if (filename.length <= maxLength) return filename;

  const suffix = filename.split(".").pop();
  const name = filename.slice(0, maxLength - 4);

  return `${name}...${suffix}`;
}
