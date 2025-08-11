import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const directoryPath = './src'
const outputFilePath = path.join(__dirname, 'typesList.ts')

const collectedTypes = new Set()

/**
 * scan files in specified directory to find all types and interfaces
 * scans text in search of regex /(?:type|interface)\s+(\w+)/g
 * also catches instances in which 'type' or 'interface' appear elsewhere
 * e.g. if you have a code comment like "// ensure type matches for type safety" you will have 'matches' and 'safety' in your output
 *  */

export function findTypesAndInterfaces(dir: string) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)

    if (fs.statSync(fullPath).isDirectory()) {
      findTypesAndInterfaces(fullPath)
    } else if (fullPath.endsWith('ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const typeMatches = content.match(/(?:type|interface)\s+(\w+)/g)

      if (typeMatches) {
        typeMatches.forEach((match) => {
          const typeName = match.split(' ')[1]
          collectedTypes.add(typeName)
        })
      }
    }
  })
}

findTypesAndInterfaces(directoryPath)

console.log(`Types and interfaces written to ${outputFilePath}`)

fs.mkdirSync(path.join(__dirname, '../types'), { recursive: true })

const collectedTypesArray = JSON.stringify([...collectedTypes].sort())
fs.writeFileSync(
  outputFilePath,
  `export const collectedTypes = ${collectedTypesArray}`,
  'utf-8'
)
