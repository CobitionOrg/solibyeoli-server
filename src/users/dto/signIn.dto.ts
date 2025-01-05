import { IsString } from 'class-validator';

export class SignInDto {
    @IsString()
    user_email: string;

    @IsString()
    user_password: string;
}
