import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/httpExceptionFilter';
import { WordController } from './word/word.controller';
import { WordService } from './word/word.service';
import { WordModule } from './word/word.module';
import { UsersModule } from './users/users.module';
import { ScoreController } from './score/score.controller';
import { ScoreService } from './score/score.service';
import { ScoreModule } from './score/score.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        WordModule,
        UsersModule,
        ScoreModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        Logger,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
