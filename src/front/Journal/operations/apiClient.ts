import { EntryProps, RoutineListHistoryProps } from '../../../../types/app.d'

export class ApiError extends Error {
  status?: number

  constructor({ message, status }: { message: string; status?: number }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BASE_URL = 'http://localhost:3001'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!res.ok) {
        throw new ApiError({
          message: `API Error: ${res.statusText}`,
          status: res.status,
        })
      }

      return await res.json()
    } catch (err) {
      if (err instanceof ApiError) {
        throw err
      }
      throw new ApiError({
        message: `Network Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      })
    }
  }

  async fetchEntry(date: string): Promise<EntryProps | null> {
    try {
      return await this.request<EntryProps>(`/entry/${date}`)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return null // entry doesn't exist, which is valid
      }
      throw err
    }
  }

  async createEntry(date: string, entry: EntryProps): Promise<EntryProps> {
    return await this.request<EntryProps>(`/entry/${date}`, {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  }

  async updateEntry(date: string, entry: EntryProps): Promise<EntryProps> {
    return await this.request<EntryProps>(`/entry/${date}`, {
      method: 'PATCH',
      body: JSON.stringify(entry),
    })
  }

  async fetchLists(): Promise<RoutineListHistoryProps> {
    return await this.request<RoutineListHistoryProps>('/list')
  }

  async fetchTodayEntry(): Promise<EntryProps | null> {
    try {
      return await this.request<EntryProps>('/today')
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        return null
      }

      throw err
    }
  }
}

export const apiClient = new ApiClient()
