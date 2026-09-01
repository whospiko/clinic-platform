import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

import { ApiErrorResponse } from '../api/response.type';

type HttpRequestLike = {
    url: string;
    originalUrl?: string;
    method?: string;
};

type HttpResponseLike = {
    status: (statusCode: number) => {
        json: (body: ApiErrorResponse & Record<string, unknown>) => void;
    };
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    private readonly nodeEnv = process.env['NODE_ENV'];

    private readonly isDev =
        this.nodeEnv === 'development' ||
        this.nodeEnv === 'dev' ||
        !this.nodeEnv;

    catch(exception: unknown, host: ArgumentsHost): void {
        const http = host.switchToHttp();

        const request = http.getRequest<HttpRequestLike>();
        const response = http.getResponse<HttpResponseLike>();

        const path = request.originalUrl ?? request.url;
        const method = request.method ?? 'UNKNOWN';

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException ? exception.getResponse() : null;

        const errorBody = this.buildErrorBody({
            exception,
            exceptionResponse,
            statusCode,
            path,
        });

        this.logException(exception, method, path, statusCode);

        response.status(statusCode).json(errorBody);
    }

    private buildErrorBody(params: {
        exception: unknown;
        exceptionResponse: string | object | null;
        statusCode: number;
        path: string;
    }): ApiErrorResponse & Record<string, unknown> {
        const { exception, exceptionResponse, statusCode, path } = params;

        const baseBody: ApiErrorResponse & Record<string, unknown> = {
            success: false,
            code: this.statusToCode(statusCode),
            message: 'Request failed',
            timestamp: new Date().toISOString(),
            path,
        };

        if (typeof exceptionResponse === 'string') {
            baseBody.message = exceptionResponse;
        } else if (exceptionResponse && typeof exceptionResponse === 'object') {
            const body = exceptionResponse as Record<string, unknown>;

            const rawMessage = body['message'];
            const rawError = body['error'];

            const isValidationError = Array.isArray(rawMessage);

            baseBody.message = isValidationError
                ? 'Validation failed'
                : String(rawMessage ?? rawError ?? 'Request failed');

            if (isValidationError) {
                baseBody.errors = rawMessage;
            } else if (rawError) {
                baseBody.errors = rawError;
            }
        } else {
            baseBody.code = 'INTERNAL_SERVER_ERROR';
            baseBody.message = 'Internal server error';
        }

        /**
         * Only expose real error details in development.
         * Never expose stack trace in production.
         */
        if (this.isDev) {
            baseBody['debug'] = this.buildDebugError(exception);
        }

        return baseBody;
    }

    private buildDebugError(exception: unknown): Record<string, unknown> {
        if (exception instanceof Error) {
            return {
                name: exception.name,
                message: exception.message,
                stack: exception.stack,
            };
        }

        return {
            message: String(exception),
            raw: exception,
        };
    }

    private logException(
        exception: unknown,
        method: string,
        path: string,
        statusCode: number,
    ): void {
        if (exception instanceof Error) {
            this.logger.error(
                `[${method}] ${path} ${statusCode} - ${exception.message}`,
                exception.stack,
            );

            return;
        }

        this.logger.error(
            `[${method}] ${path} ${statusCode} - ${JSON.stringify(exception)}`,
        );
    }

    private statusToCode(statusCode: number): string {
        const map: Record<number, string> = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'UNPROCESSABLE_ENTITY',
            429: 'TOO_MANY_REQUESTS',
            500: 'INTERNAL_SERVER_ERROR',
        };

        return map[statusCode] ?? 'REQUEST_ERROR';
    }
}