import { IsNumber } from 'class-validator';

export class DeleteWordDto {
    @IsNumber()
    id: number;
}
