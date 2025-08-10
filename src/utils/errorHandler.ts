import { Response } from 'express'

export function handleError(
  error: unknown,
  res: Response,
  defaultMessage: string = 'An error occurred.'
): void {
  // check if response has already been sent
  if (res.headersSent) {
    console.error('Headers already sent, cannot send error response:', error)
    return
  }
  let errorMessage = defaultMessage

  if (error instanceof Error) {
    errorMessage = error.message
  }

  res.status(500).json({
    message: errorMessage,
    error: error instanceof Error ? error.stack : {},
  })
}

// TODO:
// custom error objects - custom error classes that encapsulate relevant info about the error like type, message, and context clues for debugging
// logging and monitoring tools - look into frameworks and monitoring tools that capture and analyze errors in a structured way to simplify identifying patterns and trends with my errors overall (over time allowing me to see where the code is faulty)
// more user-friendly error messages: clear, concise errors to guide the user or dev towards a better understanding will help with quicker resolution (without requiring them to parse the stack trace)
