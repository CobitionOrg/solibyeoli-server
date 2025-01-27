import { IsNumber } from 'class-validator';

export class PageDto {
    @IsNumber()
    page: number;

    @IsNumber()
    limit: number;
}
