import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './middleware/logger/winston.log';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: winstonLogger,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, //유효성이 안맞으면 접근이 안되게
            forbidNonWhitelisted: true, //이상한걸 보내면 아예 막아버림
            transform: true, //유저가 보낸 데이터를 우리가 원하는 타입으로 바꿔줌 개꿀임
            transformOptions: {
                enableImplicitConversion: true, // 암묵적 변환 활성화(param도 DTO로 자동변환 사용 가능)
            },
        }), //유효성을 검사하기 위한 일종의 미들웨어 api에서 받은걸 타입을 맞춰줌
    );

    const config = new DocumentBuilder()
        .setTitle('swagger title')
        .setDescription('swagger description')
        .setVersion('1.0')
        .addTag('tag')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // 본문 크기 제한 설정
    // JSON 및 URL-encoded 본문 크기 제한 늘리기
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    await app.listen(3000);
}
bootstrap();
