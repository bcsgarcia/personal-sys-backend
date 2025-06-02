// src/supabase/supabase.repository.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthSupabaseRepository {
  // constructor(
  //   @Inject('SUPABASE_CLIENT')
  //   private readonly supabase: SupabaseClient,
  // ) {}
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  async findAllUsers() {
    return this.supabase.auth.admin.listUsers();
  }

  async findUserById(userId: string) {
    return this.supabase.auth.admin.getUserById(userId);
  }

  async toggleUserAccess(userId: string, enabled: boolean) {
    return this.supabase.auth.admin.updateUserById(userId, {
      app_metadata: { enabled: enabled },
    });
  }

  async sendResetPasswordEmail(email: string, redirectTo: string) {
    return this.supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo },
    });
  }

  async deleteUser(userId: string) {
    console.log('Excluindo usuário:', userId);
    return this.supabase.auth.admin.deleteUser(userId);
  }

  async createUser(dto: CreateUserDto) {
    return this.supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      role: dto.role ?? 'user',
      email_confirm: dto.emailConfirmed ?? true,
      user_metadata: dto.user_metadata,
      app_metadata: dto.app_metadata,
    });
  }
}
