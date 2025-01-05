import { IsNumber } from 'class-validator';

export class CreateScoreDto {
    @IsNumber()
    score: number;

    @IsNumber()
    step_id: number;
}
