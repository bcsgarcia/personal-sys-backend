import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthSupabaseService } from '../service/auth-supabase.service';
import { SyncSupabaseDto } from '../dto/request/sync-supabase.dto';
import { CreateSupabaseUserDto } from '../dto/request/create-user.dto';

@ApiTags('auth_supabase')
@Controller('auth_supabase')
export class AuthSupabaseController {
  constructor(private readonly authSupabaseService: AuthSupabaseService) {}

  // @Public()
  @Get()
  findAllSupabase() {
    return this.authSupabaseService.findAllUsers();
  }

  // @Public()
  @Get(':id')
  findOneSupabase(@Param('id') id: string) {
    return this.authSupabaseService.findUserById(id);
  }

  // @Public()
  @Post(':id/enable')
  enableSupabase(@Param('id') id: string) {
    return this.authSupabaseService.enableUser(id);
  }

  @Post(':id/disable')
  disableSupabase(@Param('id') id: string) {
    return this.authSupabaseService.disableUser(id);
  }

  // @Post('send-reset-email')
  // sendResetSupabase(@Body() body: SendResetDto) {
  //   return this.authSupabaseService.sendResetPasswordEmail(body.email, body.redirectTo);
  // }

  @Delete(':id')
  delete(
    @Param('supabaseAuthId') idSupabase: string,
    @Param('clientId') idClient: string,
  ) {
    return this.authSupabaseService.deleteUser(idSupabase, idClient);
  }

  @Post()
  createSupabaseUser(@Body() dto: CreateSupabaseUserDto) {
    return this.authSupabaseService.createUser(dto);
  }

  @Post('/sync-supabase-auth')
  @ApiBody({ type: SyncSupabaseDto })
  syncSupabaseAuth(@Body() dto: SyncSupabaseDto) {
    return this.authSupabaseService.syncClientsWithAuthUsers(dto.isAdmin);
  }

  @Post('/delete-all-supabase-auth')
  @ApiBody({ type: SyncSupabaseDto })
  deleteAllSupabaseAuth(@Body() dto: SyncSupabaseDto) {
    return this.authSupabaseService.deleteAllUsers(dto.isAdmin);
  }
}
