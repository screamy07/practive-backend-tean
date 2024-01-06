import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        ...exception.getResponse() as object,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }

}
