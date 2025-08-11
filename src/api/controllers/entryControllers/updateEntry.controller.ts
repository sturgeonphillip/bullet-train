import fs from 'node:fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'node:url'
import { Request, Response } from 'express'

import { handleError } from '../../../utils/errorHandler'
import { EntryProps } from '../../factories'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePath = path.join(__dirname, '../../../../db/entries.json')

export const updateEntry = async (req: Request, res: Response) => {
  try {
    const entryKey = req.params.date
    // const updatedRoutines = req.body.routines;

    // console.log('UPDATEDROUTINES', updatedRoutines);
    let existingData: { [key: string]: EntryProps } = {}

    try {
      const content = await fs.readFile(filePath, 'utf8')
      existingData = JSON.parse(content)
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = {}
      } else {
        return handleError(err, res, 'Error reading file contents.')
      }
    }

    let entry: EntryProps = existingData[entryKey]

    entry = { ...req.body }
    existingData[entryKey] = entry

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8')

    res.status(204).send()
  } catch (err) {
    handleError(err, res, 'Error updating entry.')
  }
}
