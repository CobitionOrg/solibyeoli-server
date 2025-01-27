import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { CreateWordDto } from './dto/createWord.dto';
import { UpdateWordDto } from './dto/updateWord.dto';
import { generateUploadURL } from 'src/utils/s3.util';

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

    /**
     * 단어 관련 데이터 생성
     * @param createWordDto
     * @returns
     */
    async createWordData(createWordDto: CreateWordDto) {
        const step_id = await this.getIdFromStepsTable(
            createWordDto.grade,
            createWordDto.seq_id,
        );

        if (createWordDto.pronunciation_url) {
            createWordDto.pronunciation_url =
                createWordDto.pronunciation_url.split('?')[0];
        }

        const res = await this.adminRepository.createWordData(
            createWordDto,
            step_id,
        );

        return { success: true, status: HttpStatus.CREATED, data: res };
    }

    /**
     * 단어 관련 데이터 수정
     * @param updateWordDto
     * @returns
     */
    async updateWordData(updateWordDto: UpdateWordDto) {
        const step_id = await this.getIdFromStepsTable(
            updateWordDto.grade,
            updateWordDto.seq_id,
        );

        if (updateWordDto.pronunciation_url) {
            updateWordDto.pronunciation_url =
                updateWordDto.pronunciation_url.split('?')[0];
        }

        const res = await this.adminRepository.updateWordData(
            updateWordDto,
            step_id,
        );

        return { success: true, status: HttpStatus.OK, data: res };
    }

    /**
     * 파일 업로드를 위한 presigned url 발급
     * @param fileName
     * @returns
     */
    async getPresignedUrl(fileName: string) {
        if (!fileName) {
            throw new Error('File name is required');
        }
        const url = await generateUploadURL();

        return { success: true, url: url, status: HttpStatus.OK };
    }
}
