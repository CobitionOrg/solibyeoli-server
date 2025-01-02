import { IsString } from 'class-validator';

export class SignUpDto {
    @IsString()
    user_email: string;

    @IsString()
    user_password: string;

    @IsString()
    name: string;
}
