import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWordDto } from './dto/createWord.dto';

@Injectable()
export class WordRepository {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(WordRepository.name);

  async createWord(createWordDto: CreateWordDto) {
    try {
      const res = await this.prisma.krWord.create({
        data: { ...createWordDto },
      });

      return { success: true, status: HttpStatus.CREATED, data: res };
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(
        {
          success: false,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          msg: '내부 서버 에러',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
