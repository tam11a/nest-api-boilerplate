import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HttpException } from '@nestjs/common';
import { PrismaExceptionHandler } from './prisma.filter';
import { HttpExceptionHandler } from './http.filter';
import { UnknownExceptionHandler } from './unknown.filter';
import { ErrorResponse } from 'lib/interfaces/response.interface';

type ErrType = { [key: string]: string };

type ErrorClassifier = {
  [key: string]: (err: ErrType) => boolean;
};

const classifiers: ErrorClassifier = {
  prisma: (err) => !!err?.name?.startsWith('PrismaClient'),
  http: (err) => err?.getResponse !== undefined,
};

@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BaseExceptionFilter.name);
  private readonly httpHandler = new HttpExceptionHandler();
  private readonly prismaHandler = new PrismaExceptionHandler();
  private readonly unknownHandler = new UnknownExceptionHandler();
  private readonly production = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Skip favicon and health checks
    if (['/favicon.ico', '/health'].includes(request.url)) return;

    let errorResponse: ErrorResponse;

    // Handle specific error types
    if (classifiers.prisma(exception as ErrType)) {
      errorResponse = this.prismaHandler.handle(
        exception as PrismaClientKnownRequestError,
        request,
      );
    } else if (classifiers.http(exception as ErrType)) {
      errorResponse = this.httpHandler.handle(
        exception as HttpException,
        request,
      );
    } else {
      errorResponse = this.unknownHandler.handle(exception, request);
    }

    if (!this.production)
      // Log the error in development
      this.logger.error(exception);

    // Send formatted response
    response.status(errorResponse.status).json(errorResponse);
  }
}
