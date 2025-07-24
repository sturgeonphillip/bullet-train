import { useState, useEffect } from 'react'
import './errands.css'
import Form from './Form'
import Errand from './ErrandA'
import { ErrandProps } from './createErrand'

const Display = () => {
  const [errands, setErrands] = useState<ErrandProps[]>([])

  const handleComplete = async (id: string) => {
    if (!id) {
      console.error(
        `Attempt to update errand failed. Item is either null or undefined, or the function was called without an argument. The id logs as ${id}`
      )
      return
    }

    const errandIndex = errands.findIndex((errand) => errand.id === id)

    if (errandIndex === -1) {
      console.error(`Errand with id ${id} not found.`)
      return
    }

    const errandToUpdate = { ...errands[errandIndex] }
    errandToUpdate.complete = !errandToUpdate.complete
    errandToUpdate.timeExecuted = errandToUpdate.complete ? Date.now() : 0

    const payload = {
      complete: errandToUpdate.complete,
      timeExecuted: errandToUpdate.timeExecuted,
    }

    setErrands((prev) => {
      const allErrands = [...prev]
      allErrands[errandIndex] = errandToUpdate

      return allErrands
    })

    // update errand in db
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }

      const res = await fetch(`http://localhost:3001/errands/${id}`, options)

      if (!res.ok) {
        throw new Error('Failed to update errand in database.')
      }

      console.log(`Errand ${errandToUpdate.name.toUpperCase()} was updated:`)

      console.log(JSON.parse(JSON.stringify(errandToUpdate)))
    } catch (err) {
      console.error(`Error when updating errands: ${err}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error(
        `Attempt to delete errand failed. Item is either null or undefined, or the function was called without an argument. Id logs as ${id}.`
      )
      return
    }

    const errandIndex = errands.findIndex((errand) => errand.id === id)

    if (errandIndex === -1) {
      console.error(`Errand with id ${id} is not found.`)
      return
    }

    const errandToDelete = { ...errands[errandIndex] }

    // remove errand from errands state
    setErrands((prevErrands) =>
      prevErrands.filter((errand) => errand.id !== id)
    )

    try {
      const options = {
        method: 'DELETE',
      }

      const res = await fetch(`http://localhost:3001/errands/${id}`, options)

      if (!res.ok) {
        throw new Error(
          `Failed to delete errand from database. Status code: ${res.status}`
        )
      }

      console.log(`Errand ${errandToDelete.name.toUpperCase()} was deleted.`)
    } catch (err) {
      console.log('ERR OBJECT:')
      console.log(err)
      // console.error(`Error when deleting errand: ${err}`)

      // add errand back to errands array if error on deleting in database

      setErrands((prevErrands) => [...prevErrands, errandToDelete])
    }
  }

  useEffect(() => {
    requestErrands()
  }, [])

  async function requestErrands() {
    let res
    try {
      // const res = await fetch(`http://localhost:3001/errands`)
      // const text = await res.text()
      res = await fetch(`http://localhost:3001/errands`)
      const text = await res.text()

      // console.log('Response length:', text.length)
      // console.log('Response preview (first 100 chars):', text.slice(0, 100))
      // console.log('Response end (last 100 chars):', text.slice(-100))

      // const errorContext = text.slice(506, 606) // show 50 chars before and after
      // console.log('Error context (around position 556):', errorContext)

      // split into lines to verify line numbers
      // const lines = text.split('\n')
      // console.log('Line 22 content:', lines[21])

      if (!res.ok) {
        throw new Error(`Network response not ok. Status: ${res.status}`)
      }

      // parse JSON separately to catch exact error position
      const saved = JSON.parse(text) // will throw detailed SyntaxError
      // await res.json()
      setErrands(saved)
    } catch (err) {
      // console.error(`There was a problem with the fetch operation: ${err}`)
      console.error('Fetch operation details:', {
        url: 'http://localhost:3001/errands',
        status: res?.status,
        statusText: res?.statusText,
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : null,
      })
      throw err
    }
  }

  return (
    <>
      <div className='errands-container'>
        <div className='errands-title-div'>
          <h2>Errands</h2>
        </div>

        <div className='errands-form-button-container-div'>
          <Form onNewErrandAdd={requestErrands} />
        </div>

        <ul>
          {errands.length > 0 ? (
            errands.map((errand) => (
              <Errand
                key={errand.id}
                id={errand.id}
                name={errand.name}
                complete={errand.complete}
                timeAssigned={errand.timeAssigned}
                timeExecuted={errand.timeExecuted}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p>No errands to complete.</p>
          )}
        </ul>
      </div>
    </>
  )
}

export default Display

// 114  async function requestErrands() {
// 115      try {
// 116        const res = await fetch(`http://localhost:3001/errands`)
// 117
// 118        if (!res.ok) {
// 119          throw new Error(`Network response not ok. Status: ${res.status}`)
// 120        }
// 121
// 122        const saved = await res.json()
// 123        setErrands(saved)
// 124      } catch (err) {
// 125        console.error(`There was a problem with the fetch operation: ${err}`)
// 126      }
// 127    }
