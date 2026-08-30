import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiErrorResponse } from '../api/response.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const http = host.switchToHttp();

        const request = http.getRequest<{
            url: string;
            originalUrl?: string;
        }>();

        const response = http.getResponse<{
            status: (statusCode: number) => {
                json: (body: ApiErrorResponse) => void;
            };
        }>();

        const path = request.originalUrl ?? request.url;

        const statusCode =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException ? exception.getResponse() : null;

        const errorBody = this.buildErrorBody(
            exceptionResponse,
            statusCode,
            path,
        );

        response.status(statusCode).json(errorBody);
    }

    private buildErrorBody(
        exceptionResponse: string | object | null,
        statusCode: number,
        path: string,
    ): ApiErrorResponse {
        if (typeof exceptionResponse === 'string') {
            return {
                success: false,
                code: this.statusToCode(statusCode),
                message: exceptionResponse,
                timestamp: new Date().toISOString(),
                path,
            };
        }

        if (exceptionResponse && typeof exceptionResponse === 'object') {
            const body = exceptionResponse as Record<string, unknown>;

            const rawMessage = body['message'];

            const isValidationError = Array.isArray(rawMessage);

            return {
                success: false,
                code: this.statusToCode(statusCode),
                message: isValidationError
                    ? 'Validation failed'
                    : String(rawMessage ?? body['error'] ?? 'Request failed'),
                errors: isValidationError ? rawMessage : body['error'],
                timestamp: new Date().toISOString(),
                path,
            };
        }

        return {
            success: false,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
            path,
        };
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