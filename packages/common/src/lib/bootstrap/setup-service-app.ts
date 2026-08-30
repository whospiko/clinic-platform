import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '../errors/global-exception.filter';
import { ResponseInterceptor } from '../api/response.interceptor';

export type SetupServiceAppOptions = {
    serviceName: string;
    title: string;
    description: string;
    version?: string;
    swaggerPath?: string;
    globalPrefix?: string
};

export function setupServiceApp(
    app: INestApplication,
    options: SetupServiceAppOptions,
): void {

    const globalPrefix = options.globalPrefix;

    if (globalPrefix) {
        app.setGlobalPrefix(globalPrefix);
    }

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());
    
    app.useGlobalInterceptors(new ResponseInterceptor());

    const swaggerPath = options.swaggerPath ?? 'docs';

    const swaggerConfig = new DocumentBuilder()
        .setTitle(options.title)
        .setDescription(options.description)
        .setVersion(options.version ?? '1.0.0')
        .addTag(options.serviceName)
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(swaggerPath, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    Logger.log(
        `${options.serviceName} Swagger docs available at /${swaggerPath}`,
    );
}