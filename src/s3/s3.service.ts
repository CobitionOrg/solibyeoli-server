import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    constructor(
        @Inject('S3_CLIENT')
        private readonly s3Client: S3Client,

        private readonly configService: ConfigService,
    ) {}

    async getPresignedUrl(fileName: string): Promise<string> {
        const fname = `${Date.now()}${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.configService.get('AWS_BUCKET'),
            Key: fname,
        });

        const signedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 60 * 3, // 3분
        });

        return signedUrl;
    }
}
