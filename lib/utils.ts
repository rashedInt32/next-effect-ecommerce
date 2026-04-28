import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface RetryOptions {
  retries: number
  delay: number
  signal?: AbortSignal
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { retries, delay, signal } = options

  if (signal?.aborted) {
    throw new Error("Retry aborted")
  }

  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }

    if (signal?.aborted) {
      throw new Error("Retry aborted")
    }

    const nextDelay = delay * 2

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(resolve, delay)

      if (signal) {
        const abortHandler = () => {
          clearTimeout(timeout)
          reject(new Error("Retry aborted"))
        }

        if (signal.aborted) {
          abortHandler()
        } else {
          signal.addEventListener("abort", abortHandler, { once: true })
        }
      }
    })

    return retryAsync(fn, { retries: retries - 1, delay: nextDelay, signal })
  }
}

/*
Example usage:

async function fetchData(): Promise<string> {
  const response = await fetch("https://api.example.com/data")
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.text()
}

const controller = new AbortController()
setTimeout(() => controller.abort(), 10000)

try {
  const data = await retryAsync(fetchData, {
    retries: 3,
    delay: 1000,
    signal: controller.signal
  })
  console.log(data)
} catch (error) {
  console.error("Failed after retries:", error)
}
*/
