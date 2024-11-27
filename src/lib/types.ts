import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
  createdAt: number
}

export interface Chat extends Record<string, any> {
  sessionId: string
  messages: Message[]
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>