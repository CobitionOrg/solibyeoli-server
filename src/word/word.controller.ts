import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/createWord.dto';

@ApiTags('word')
@Controller('word')
export class WordController {
  constructor(private readonly wordSevice: WordService) {}

  private readonly logger = new Logger(WordController.name);

  @ApiOperation({ summary: '엑셀 파일에서 데이터 생성' })
  @Post('/createBulk')
  async createBulk(@Body() createWordDtos: Array<CreateWordDto>) {
    const res = await this.wordSevice.createWords(createWordDtos);

    return res;
  }
}
