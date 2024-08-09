export interface BottleProps {
  dateKey: string;
  id: string;
  color: string;
  ounces: number;
  setOunces?: (oz: number) => void;
}

export interface TotalOzProps {
  color: string;
  ounces: number;
  setOunces: (value: number) => void;
  commitValue: (value: number[]) => void;
}

export interface DynamicRequestBody<V> {
  [key: string]: V;
}

export interface DebounceTotalOzProps {
  timeout: NodeJS.Timeout | null;
  abort: AbortController | null;
  value: DynamicRequestBody<string | number | number[]>;
  dateKey: string;
}
