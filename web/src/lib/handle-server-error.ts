import axios from 'axios';

interface ServerErrorResponse {
  error?: string;
}

export function handleServerError(error: unknown): never {
  if (axios.isAxiosError<ServerErrorResponse>(error)) {
    const message = error.response?.data?.error ?? error.message;
    throw new Error(message, { cause: error });
  }

  if (error instanceof Error) throw error;
  throw new Error('An unexpected server error occurred.', { cause: error });
}
