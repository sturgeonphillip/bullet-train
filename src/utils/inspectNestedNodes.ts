type InspectableObjectType<T> = T | Array<T>
type InspectableDataProps = InspectableObjectType<Record<string, unknown>>

export function inspectNestedNodes<T extends InspectableDataProps>(
  data: T,
  indentLevel = 0
): string {
  const indent = ' '.repeat(indentLevel * 2)
  let result = ''

  if (Array.isArray(data)) {
    result += `${indent}${indent}A(${data.length}): [\n`
    data.forEach((item) => {
      result += inspectNestedNodes(item, indentLevel + 2)
    })
    result += `${indent}${indent}]`
  } else if (typeof data === 'object' && data !== null) {
    result += `${indent}Object: {\n`
    Object.entries(data).forEach(([key, value], index) => {
      result += `${indent} ${key}: `
      if (typeof value === 'object' && value !== null) {
        result += inspectNestedNodes(value as InspectableDataProps)
      } else {
        result += `${value}\n`
      }
      if (index < Object.keys(data).length - 1) {
        result += ',\n'
      }
    })
    result += `${indent}`
  } else {
    result += `${indent}${data}\n`
  }

  return result
}
