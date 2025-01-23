import { IsNumber, Max, Min } from 'class-validator';

export class GetWordsByGradeAndStep {
    @IsNumber()
    @Min(1)
    @Max(6)
    grade: number;

    @IsNumber()
    seq_id: number;
}
