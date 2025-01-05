import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { GetWordsByGradeAndStep } from './dto/getWordsByGradeAndStep.dto';
import { DeleteWordDto } from './dto/deleteWord.dto';

@Controller('admin')
@UseGuards(AuthGuard)
@Roles(true) // is_admin: true인 경우만 접근 가능
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    private readonly logger = new Logger(AdminController.name);

    @ApiOperation({ summary: '학년, 차수로 단어들 조회' })
    @Get('/words/:grade/:seq_id')
    async getWordsByGradeAndStep(@Param() params: GetWordsByGradeAndStep) {
        // console.log('grade: ', params.grade, typeof params.grade);
        // console.log('seq: ', params.seq_id, typeof params.seq_id);

        const res = await this.adminService.getWordsByGradeAndStep(
            params.grade,
            params.seq_id,
        );

        return res;
    }

    // 단어 삭제(soft delete)
    @ApiOperation({ summary: '단어 삭제' })
    @Patch('/word')
    async deleteWord(@Body() deleteWordDto: DeleteWordDto) {
        const res = await this.adminService.deleteWord(deleteWordDto.id);

        return res;
    }

    // 단어 데이터 수정
    @ApiOperation({ summary: '단어 데이터 수정' })
    @Patch('/word-data')
    async updateWordData() {}

    // 단어 추가
    @ApiOperation({ summary: '단어 데이터 추가' })
    @Post('/word-data')
    async createWordData() {}
}
