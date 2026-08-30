export type ApiSuccessResponse<T = unknown> = {
    success: true;
    code: string;
    message: string;
    data: T;
    meta?: unknown;
    timestamp: string;
    path: string;
};

export type ApiErrorResponse = {
    success: false;
    code: string;
    message: string;
    errors?: unknown;
    timestamp: string;
    path: string;
};

export type ApiResponse<T = unknown> =
    | ApiSuccessResponse<T>
    | ApiErrorResponse;