import { IsBoolean, IsNumber } from 'class-validator';

export class CreateScoreResultDto {
    @IsNumber()
    question_id: number;

    @IsBoolean()
    is_collect: boolean;
}
