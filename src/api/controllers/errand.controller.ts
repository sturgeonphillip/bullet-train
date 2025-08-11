import fs from 'node:fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'node:url'
import { Request, Response } from 'express'

import { handleError } from '../../utils/errorHandler'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePath = path.join(__dirname, '../../../db/errands.json')

const getErrands = async (_req: Request, res: Response) => {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const errands = JSON.parse(content)

    res.status(200).json(errands)
  } catch (err) {
    handleError(err, res, 'Error reading data from file.')
  }
}

const getErrand = async (req: Request, res: Response) => {
  try {
    const errandKey = req.params.id
    const content = await fs.readFile(filePath, 'utf8')

    const data: ErrandProps[] = await JSON.parse(content)

    const errandIdx = data.findIndex(
      (errand: ErrandProps) => errand.id === errandKey
    )

    if (errandIdx === -1) {
      res.status(404).send({ message: 'No errand found with provided id.' })
      return
    }

    const errand = data[errandIdx]

    res.status(200).send(errand)
  } catch (err) {
    handleError(err, res, 'Error reading errand from database.')
  }
}

const createErrand = async (req: Request, res: Response) => {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    const data = await JSON.parse(content)
    const errand = req.body
    data.push(errand)

    await fs.writeFile(filePath, JSON.stringify(data), 'utf8')
    res.status(200).send(errand)
  } catch (err) {
    handleError(err, res, 'Error while saving the errand to file.')
  }
}

const updateErrand = async (req: Request, res: Response) => {
  try {
    const errandKey = req.params.id
    let existingData: ErrandProps[] = []

    try {
      const content = await fs.readFile(filePath, 'utf8')

      existingData = await JSON.parse(content)
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = []
        return
      } else {
        handleError(err, res, 'Error reading existing content from file.')
      }
    }

    const errandIdx = existingData.findIndex(
      (errand: ErrandProps) => errand.id === errandKey
    )

    if (errandIdx === -1) {
      res.status(404).send({ message: 'No errand found with provided id.' })
      return
    }

    const errand: ErrandProps = req.body
    existingData[errandIdx] = { ...existingData[errandIdx], ...errand }

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8')

    res.status(204).send()
  } catch (err) {
    handleError(err, res, 'Error updating errand.')
  }
}

const destroyErrand = async (req: Request, res: Response) => {
  try {
    const errandKey = req.params.id
    let existingData: ErrandProps[] = []

    try {
      const content = await fs.readFile(filePath, 'utf8')

      existingData = await JSON.parse(content)
    } catch (err) {
      if (err instanceof SyntaxError) {
        existingData = []
        return
      } else {
        handleError(err, res, 'Error reading existing content from file.')
      }
    }

    const errandIdx = existingData.findIndex(
      (errand: ErrandProps) => errand.id === errandKey
    )

    if (errandIdx === -1) {
      res.status(404).send({ message: 'No errand found with provided id.' })
      return
    }

    existingData.splice(errandIdx, 1)

    await fs.writeFile(filePath, JSON.stringify(existingData), 'utf8')

    res.status(204).send()
  } catch (err) {
    handleError(err, res, 'Error updating errand.')
  }
}

// TODO: move types
interface ErrandProps {
  id: string
  name: string
  complete: boolean
  timeAssigned: number
  timeExecuted: number
}

export { getErrands, getErrand, createErrand, updateErrand, destroyErrand }
