import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GetStepsByGradeDto {
    @IsNumber()
    @Min(0)
    @Max(6)
    @Type(() => Number) // 숫자 타입 변환
    grade: number;

    @IsNumber()
    @Type(() => Number) // 숫자 타입 변환
    amount: number;
}
