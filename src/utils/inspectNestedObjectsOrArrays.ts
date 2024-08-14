// takes object or array as input and recursively checks for nested structures, printing keys:values along the way.
// can be adapted to log detailed info about nested structures (or perform oher operations as needed)

// Generic types created to maintain type safety that is considerate of needed flexibility when data structure is not known until runtime
type InspectableObjectType<T> = T | Array<T>;
type InspectableDataProps = InspectableObjectType<Record<string, unknown>>;

export function inspectNestedObjectsOrArrays<T extends InspectableDataProps>(
  data: T,
  indentLevel = 0
): string {
  const indent = ' '.repeat(indentLevel * 2);
  let result = '';

  if (Array.isArray(data)) {
    result += `${indent}Array (${data.length}):`;
    data.forEach((item, index) => {
      result += `\n${indent}${indentLevel + 1}. Inspecting item ${index + 1}:\n`;
      result += inspectNestedObjectsOrArrays(item, indentLevel + 1);
    });
  } else if (typeof data === 'object' && data !== null) {
    result += `${indent}Object:`;
    Object.entries(data).forEach(([key, value]) => {
      result += `\n${indent}${indentLevel + 1}. ${key}:`;
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value) || typeof value === 'object') {
          result += inspectNestedObjectsOrArrays(
            value as InspectableDataProps,
            indentLevel + 1
          );
        } else {
          console.error('Value does not match expected structure:', value);
        }
      } else {
        result += `\n${indent}${indentLevel + 2}. ${value}`;
      }
    });
  } else {
    result += `${indent}${data}`;
  }

  return result;
}
