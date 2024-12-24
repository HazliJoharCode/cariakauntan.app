export class ChatError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ChatError';
  }
}

export class APIError extends ChatError {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}