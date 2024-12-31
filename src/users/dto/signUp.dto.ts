import { IsString } from 'class-validator';
import { SignInDto } from './signIn.dto';

export class SignUpDto extends SignInDto {
    @IsString()
    name: string;
}
