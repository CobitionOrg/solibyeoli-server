import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
    constructor(private readonly adminRepository: AdminRepository) {}

    private readonly logger = new Logger(AdminService.name);

    /**
     * 해당 학년, 차수로 단어들 조회
     * @param grade
     * @param seq
     * @returns
     */
    async getWordsByGradeAndStep(grade: number, seq: number) {
        const id = await this.getIdFromStepsTable(grade, seq);

        const res = await this.adminRepository.getWordsByStepId(id);
        // console.log(res);
        return { success: true, data: res, status: HttpStatus.OK };
    }

    /**
     * 학년, 차수로 steps 테이블의 id 조회
     * @param grade
     * @param seq
     * @returns id
     * admin 서비스 내부에서만 사용
     */
    async getIdFromStepsTable(grade: number, seq: number) {
        const res = await this.adminRepository.getIdFromStepsTable(grade, seq);
        // console.log(res);
        if (!res) {
            throw new HttpException(
                {
                    success: false,
                    msg: '해당 학년 혹은 차수는 존재하지 않습니다.',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return res.id;
    }

    /**
     * 해당 단어 soft delete
     * @param id
     * @returns
     */
    async deleteWord(id: number) {
        // 단어 조회 후 삭제가 이뤄질 것이기에 따로 id를 조회하여 데이터가 있는지 검사하진 않았습니다.
        const res = await this.adminRepository.deleteWord(id);
        // console.log(res);

        return { success: true, status: HttpStatus.NO_CONTENT };
    }
}
