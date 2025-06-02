import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '../jwt.decorator';
import { AuthSupabaseService } from '../service/auth-supabase.service';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { SyncSupabaseDto } from '../dto/request/sync-supabase.dto';

@ApiTags('auth_supabase')
@Controller('auth_supabase')
export class AuthSupabaseController {
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  @Public()
  @Get()
  findAllSupabase() {
    return this.authSupabaseService.findAllUsers();
  }

  @Public()
  @Get(':id')
  findOneSupabase(@Param('id') id: string) {
    return this.authSupabaseService.findUserById(id);
  }

  @Public()
  @Post(':id/enable')
  enableSupabase(@Param('id') id: string) {
    return this.authSupabaseService.enableUser(id);
  }

  @Public()
  @Post(':id/disable')
  disableSupabase(@Param('id') id: string) {
    return this.authSupabaseService.disableUser(id);
  }

  // @Post('send-reset-email')
  // sendResetSupabase(@Body() body: SendResetDto) {
  //   return this.authSupabaseService.sendResetPasswordEmail(body.email, body.redirectTo);
  // }

  @Public()
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.authSupabaseService.deleteUser(id);
  }

  @Public()
  @Post()
  createSupabaseUser(@Body() dto: CreateUserDto) {
    return this.authSupabaseService.createUser(dto);
  }

  @Public()
  @Post('/sync-supabase-auth')
  @ApiBody({ type: SyncSupabaseDto })
  syncSupabaseAuth(@Body() dto: SyncSupabaseDto) {
    return this.authSupabaseService.syncClientsWithAuthUsers(dto.isAdmin);
  }

  @Public()
  @Post('/delete-all-supabase-auth')
  @ApiBody({ type: SyncSupabaseDto })
  deleteAllSupabaseAuth(@Body() dto: SyncSupabaseDto) {
    return this.authSupabaseService.deleteAllUsers(dto.isAdmin);
  }
}
