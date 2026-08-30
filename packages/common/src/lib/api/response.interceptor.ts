import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiSuccessResponse } from './response.type';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiSuccessResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ApiSuccessResponse<T>> {
        const request = context.switchToHttp().getRequest<{
            url: string;
            originalUrl?: string;
        }>();

        const path = request.originalUrl ?? request.url;

        /**
         * Do not wrap Swagger docs.
         * If you wrap Swagger JSON, Swagger UI can break.
         */
        if (path.startsWith('/docs')) {
            return next.handle() as Observable<ApiSuccessResponse<T>>;
        }

        return next.handle().pipe(
            map((data) => {
                return {
                    success: true,
                    code: 'SUCCESS',
                    message: 'Request successful',
                    data,
                    timestamp: new Date().toISOString(),
                    path,
                };
            }),
        );
    }
}