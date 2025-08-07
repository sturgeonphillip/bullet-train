import { HydrationProps } from '../../types/app'

export function createHydration(goal?: number): HydrationProps {
  return {
    goal: goal ?? 0,
    totalOz: 0,
  }
}
