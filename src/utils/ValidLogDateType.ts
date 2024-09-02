// use a regex to match the desired format
// extend the string type
// add methods to match, replace, search, and split


type LogDate = string & {
  readonly[Symbol.match](pattern: RegExp): RegExpMatchArray | null;
} & {
  readonly [Symbol.replace](pattern: RegExp, replacement: string): string;
} & {
  readonly [Symbol.search](pattern: RegExp): number;
} & {
  readonly [Symbol.search](separator: string | RegExp, limit?: number): string[];
}

// match date format
const logDatePattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

// combine LogDate type with constraint to ensure proper match
type ValidLogDate = LogDate & {
  readonly match: (pattern: typeof logDatePattern) => RegExpMatchArray | null;
}


// `ValidLogDate` type combines the `LogDate` type with a constraint that ensures the `match` method returns a match for the `logDatePattern` regex.
// It effectively restricts the `logDate` param to only accept strings that match the proper format.


/**
 * As noted by the errors:
 * // ERROR! TS1024 readonly modifier can only appear on a property declaration or index signature.
 * 
 * It turns out that the above is just an overly complicated and unsuccessful suggestion intended to ensure that the string type passed as the logDate is acutely formatted as expected.
 * 
 */
