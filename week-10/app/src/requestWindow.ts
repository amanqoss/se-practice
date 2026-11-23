// Candidate times are whole minutes on one day, with 1440 allowed as the end.
export function validRequestWindow(start: number, end: number, now: number): boolean {
  return Number.isInteger(start) && Number.isInteger(end)
    && start >= 0 && start < end && end <= 1440
    && start > now && end - start <= 120;
}
