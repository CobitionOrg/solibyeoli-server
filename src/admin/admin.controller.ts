import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { GetWordsByGradeAndStep } from './dto/getWordsByGradeAndStep.dto';
import { DeleteWordDto } from './dto/deleteWord.dto';
import { UpdateWordDto } from './dto/updateWord.dto';
import { CreateWordDto } from './dto/createWord.dto';

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
    @Delete('/word')
    async deleteWord(@Body() deleteWordDto: DeleteWordDto) {
        const res = await this.adminService.deleteWord(deleteWordDto.id);

        return res;
    }

    // 단어 수정
    @ApiOperation({ summary: '단어 수정' })
    @Patch('/word')
    async updateWordData(@Body() updateWordDto: UpdateWordDto) {
        const res = await this.adminService.updateWordData(updateWordDto);

        return res;
    }

    // 단어 추가
    @ApiOperation({ summary: '단어 추가' })
    @Post('/word')
    async createWordData(@Body() createWordDto: CreateWordDto) {
        const res = await this.adminService.createWordData(createWordDto);

        return res;
    }

    // presigned url 발급
    @ApiOperation({ summary: 's3 url 발급' })
    @Get('/s3-url')
    async getPresignedUrl(@Query('fileName') fileName: string) {
        const res = await this.adminService.getPresignedUrl(fileName);

        return res;
    }
}
