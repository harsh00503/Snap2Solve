import type { NextFunction, Request, Response } from 'express';

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const typedError = error as Error & { statusCode?: number; status?: number; type?: string };
  const statusCode = typedError.statusCode ?? typedError.status ?? 500;
  const message = typedError.type === 'entity.too.large'
    ? 'Request payload is too large. Please upload an image smaller than 5 MB.'
    : error.message || 'Something went wrong while processing your request.';

  res.status(statusCode).json({
    message
  });
}
