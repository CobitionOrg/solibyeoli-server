import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CF_BYCRYPT } from 'src/configs/bcrypt.config';

export class BcryptUtilClass {
    /**
     * 비밀번호 암호화
     * @param userPw 사용자가 입력한 비밀번호호
     * @returns 해싱된 비밀번호 문자열
     */
    async hashing(userPw: string) {
        try {
            //암호화 연산에 사용되는 salt의 cost, 높을수록 암호화 연산이 증가하는 대신 속도가 느려짐
            const saltRound = CF_BYCRYPT.saltRound;
            const salt = await bcrypt.genSalt(saltRound);
            const hashedPassword = await bcrypt.hash(userPw, salt); //비밀번호 해쉬화

            return hashedPassword; //해쉬화한 비밀번호를 데이터베이스에 저장
        } catch (err) {
            console.error(err);
            throw new HttpException(
                {
                    success: false,
                    message: '비밀번호 해싱 중 오류가 발생했습니다.',
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * 비밀번호 확인
     * @param userPw 사용자가 입력한 비밀번호
     * @param dbPw DB에 저장된 해시된 비밀번호
     * @returns 일치 시 true, 불일치 시 false
     */
    async checkLogin(userPw: string, dbPw: string) {
        try {
            const check = await bcrypt.compare(userPw, dbPw);

            return check;
        } catch (err) {
            console.error(err);
            throw new HttpException(
                {
                    success: false,
                    message: '비밀번호 검증 중 오류가 발생했습니다.',
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
