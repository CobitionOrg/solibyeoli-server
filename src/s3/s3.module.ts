import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
    controllers: [],
    providers: [
        S3Service,
        {
            provide: 'S3_CLIENT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new S3Client({
                    region: configService.get('AWS_REGION'),
                    credentials: {
                        accessKeyId: configService.get('AWS_ACCESS_KEY_ID')!,
                        secretAccessKey: configService.get(
                            'AWS_SECRET_ACCESS_KEY',
                        )!,
                    },
                });
            },
        },
    ],
    exports: [S3Service, 'S3_CLIENT'],
})
export class S3Module {}
