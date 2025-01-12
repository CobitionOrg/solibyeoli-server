import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateWordDto {
    @IsString()
    kr_word: string;

    @IsString()
    pronunciation: string;

    @IsString()
    example: string;

    @IsNumber()
    @Max(6)
    @Min(1)
    grade: number;

    @IsNumber()
    seq_id: number;
}
