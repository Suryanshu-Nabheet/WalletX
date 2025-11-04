import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  async getUsers(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const isAdmin = await this.adminService.isAdmin(userId);
    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    return this.adminService.getUsers(limit || 100, offset || 0);
  }

  @Get('users/:userId/audit-logs')
  async getUserAuditLogs(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
    @Req() req: any,
  ) {
    const adminId = req.user.sub;
    const isAdmin = await this.adminService.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    return this.adminService.getUserAuditLogs(userId, limit || 100);
  }

  @Get('users/:userId/wallets')
  async getUserWallets(@Param('userId') userId: string, @Req() req: any) {
    const adminId = req.user.sub;
    const isAdmin = await this.adminService.isAdmin(adminId);
    if (!isAdmin) {
      throw new Error('Forbidden');
    }

    return this.adminService.getUserWallets(userId);
  }
}

