import { IsNumber, IsString } from 'class-validator';

export class CreateWordDto {
  @IsString()
  kr_word: string;

  @IsString()
  pronunciation: string;

  @IsString()
  pronunciation_url: string;

  @IsString()
  example: string;

  @IsNumber()
  step_id: number;
}
