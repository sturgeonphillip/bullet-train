// def: src/front/Intended/Fix/types.ts
export interface AdjacentListsResultProps {
  before: {
    date: string
    routines: string[]
  }
  after: {
    date: string
    routines: string[]
  }
}

// def: src/front/Intended/Fix/types.ts
export interface DisplayEntryProps {
  inputDate: string
  entry: EntryProps | null
  setEntry: React.Dispatch<React.SetStateAction<EntryProps | null>>
  wizard: WizardState
}

// def: src/front/Intended/Fix/types.ts
export interface DisplayListOptionProps {
  inputDate: string
  candidates: AdjacentListsResultProps
  wizard: WizardState
  setWizard: React.Dispatch<React.SetStateAction<WizardState>>
  // TODO: change tasks as a variable to routines?
  onCreateEntry: (tasks: string[]) => void
}

// def: src/front/Intended/Fix/types.ts
export interface DisplayMissingProps {
  inputDate: string
  handler: (verdict: boolean) => void
  wizard: WizardState
}

// def: src/utils/sortEntries.ts, src/api/factories.ts
// consider changing name to EntriesCollectionProps
export interface EntriesObjectProps {
  [date: string]: EntryProps
}

/** EntryProps */
// def: src/api/controllers/entryControllers/entry.controller.ts
// export interface EntryProps {
//   date: string
//   routines: RoutineProps[]
// }
// def: src/api/factories.ts, src/front/Intended/Fix/types.ts, src/utils/sortEntries.ts
export interface EntryProps {
  id: string
  date: string
  hydration?: HydrationProps
  notes?: string
  routines: RoutineProps[]
}

/** ErrandProps */
// def: src/api/controllers/errand.controller.ts
export interface ErrandProps {
  id: string
  name: string
  complete: boolean
  timeAssigned: number
  timeExecuted: number
}

// def: src/front/Errands/createErrand.ts
export interface ErrandProps {
  id: string
  edit?: boolean
  name: string
  complete: boolean
  timeAssigned?: number
  timeExecuted?: number
  showDelete?: boolean
  onDelete?: (id: string) => void
  onComplete?: (id: string) => void
}

// src/api/controllers/list.controller.ts
export interface ExistingDataProps {
  [key: string]: string[]
}

// def: src/types/Hydration.ts
export interface HydrationProps {
  // rename from export interface HydrationDayProps {
  goal?: number
  totalOz: number
  updated?: number
}

// def: src/utils/inspectNestedNodes.ts, src/utils/inspectNestedObjectsOrArrays.ts
export type InspectableDataProps = InspectableObjectType<
  Record<string, unknown>
>

// def: src/utils/inspectNestedNodes.ts, src/utils/inspectNestedObjectsOrArrays.ts
export type InspectableObjectType<T> = T | Array<T>

/** ListOptionProps */
// def: src/front/Intended/Fix/types.ts
export type ListOptionProps = [string, string[]]

// def: src/front/Intended/Fix/operations/adjacentLists.ts
// now AdjacentListResultProps
export interface ListProps {
  before: {
    date: string | null
    tasks: string[]
  }
  after: {
    date: string | null
    tasks: string[]
  }
}

// // def: src/utils/ValidLogDateType.ts
// type LogDate = string & {
//   /**readonly */ [Symbol.match](pattern: RegExp): RegExpMatchArray | null
// } & {
//   /**readonly */ [Symbol.replace](pattern: RegExp, replacement: string): string
// } & {
//   /**readonly */ [Symbol.search](pattern: RegExp): number
// } & {
//   /**readonly */ [Symbol.search](
//     separator: string | RegExp,
//     limit?: number
//   ): string[]
// }

// def: src/front/Intended/Fix/types.ts
export type RoutineListProps = string[]

// def: src/utils/sortEntries.ts, src/api/controllers/entryControllers/entry.controller.ts
// export interface RoutineProps {
//   id: string
//   name: string
//   complete: boolean
//   timestamp: number
// }

// def: src/api/factories.ts, src/front/Intended/Fix/types.ts
export interface RoutineProps {
  id: string
  name: string
  complete: boolean
  timestamp: number
  onComplete?: (id: string) => void
}

// def: src/utils/ValidLogDateType.ts
export type ValidLogDate = LogDate & {
  readonly match: (pattern: typeof logDatePattern) => RegExpMatchArray | null
}

// def: src/services/WaterDataService.ts
export interface WaterDataProps {
  [key: string]: WaterLogProps
}

// def: src/services/WaterDataServices.ts
export interface WaterLogProps {
  logDate: string
  // (WaterMetricsProps no longer exists)
  metrics: WaterMetricsProps[]
}

export enum WizardState {
  SHOW_ENTRY = 'SHOW_ENTRY',
  MISSING_ENTRY = 'MISSING_ENTRY',
  LIST_OPTIONS = 'LIST_OPTIONS',
}

/** *** *** *** */
/** ***OTHER*** */
/** *** *** *** */

/** not previously created */
export type NoteProps = string

export interface NoteProps {
  content: string
  format?: 'plain' | 'markdown'
  createdAt?: number
}

// Later: upgrade to `Note[]` per day

/** might need: */
export interface RoutineListVersion {
  date: string
  routines: RoutineListProps
}
