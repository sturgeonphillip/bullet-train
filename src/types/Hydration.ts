export interface HydrationDayProps {
  // 0 - 128 (or higher if user exceeds goal)
  totalOunces: number;
}

export interface HydrationDbProps {
  [dateKey: string]: HydrationDayProps;
}
