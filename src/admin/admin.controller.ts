import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard)
@Roles(true) // is_admin: true인 경우만 접근 가능
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('/test')
    async test() {
        return 'admin 테스트';
    }
}
