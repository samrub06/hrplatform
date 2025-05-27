import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';

// TODO: Inject ILogger with constructor private on how show the error
// url/ stack / payload/ error message dans le message error
// TODO: remove all console log only logger
import { ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    //ArgumentsHost: Il te permet d'accéder au contexte d'exécution, dans ce cas, le contexte HTTP.
    const ctx = host.switchToHttp();
    //switchToHttp: Cela te permet d'obtenir des objets spécifiques au contexte HTTP, tels que la requête et la réponse.
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Récupérer le message de l'exception
    let message = 'An unexpected error occurred';
    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (
        typeof errorResponse === 'object' &&
        errorResponse.hasOwnProperty('message')
      ) {
        message = (errorResponse as any).message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.error(exception);
    response.status(status).json({
      statusCode: status,
      url: request.url,
      message: message,
      stack: exception instanceof Error ? exception.stack : null,
      payload: request.body,
    });
  }
}
