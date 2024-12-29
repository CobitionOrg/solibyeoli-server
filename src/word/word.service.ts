import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WordRepository } from './word.repository';
import { CreateWordDto } from './dto/createWord.dto';

@Injectable()
export class WordService {
  constructor(private readonly wordRepository: WordRepository) {}

  private readonly logger = new Logger(WordService.name);

  async createWords(createWordDtos: Array<CreateWordDto>) {
    for (const createWordDto of createWordDtos) {
      await this.wordRepository.createWord(createWordDto);
    }

    return { success: true, status: HttpStatus.CREATED };
  }
}
