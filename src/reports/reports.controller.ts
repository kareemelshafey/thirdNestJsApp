import { Body, Controller, Post, UseGuards, Patch, Param } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGaurd } from '../gaurds/auth.gaurd'
import { CurrentUser } from '../users/decorators/current-user.decorator'
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto'
import { Serialize } from '../interceptors/serialize.interceptor'
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGaurd } from '../gaurds/admin.gaurd'

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService){}

    @Post()
    @UseGuards(AuthGaurd)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGaurd)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }
}
