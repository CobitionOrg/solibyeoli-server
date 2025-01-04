import { IsArray, ValidateNested } from 'class-validator';
import { CreateScoreDto } from './createScore.dto';
import { CreateScoreResultDto } from './createScoreResult.dto';
import { Type } from 'class-transformer';

export class CreateResultDto {
    @ValidateNested() // 객체 유효성 검사
    @Type(() => CreateScoreDto) // DTO 변환
    score: CreateScoreDto;

    @IsArray() // 배열 검증
    @ValidateNested({ each: true }) // 배열 내의 각 요소 검증
    @Type(() => CreateScoreResultDto) // DTO 변환
    scoreResults: Array<CreateScoreResultDto>;
}
