// src/supabase/supabase.repository.ts
import { Injectable } from '@nestjs/common';
import {
  CreateSupabaseUserDto,
  UpdateSupabaseUserDto,
} from '../dto/request/create-user.dto';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class AuthSupabaseRepository {
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

  async findAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabase.auth.admin.listUsers();
    if (error) throw error;
    return data.users;
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

  async createUser(dto: CreateSupabaseUserDto) {
    return this.supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      role: dto.role ?? 'user',
      email_confirm: dto.emailConfirmed ?? true,
      user_metadata: dto.userMetadata,
      app_metadata: dto.appMetadata,
    });
  }

  async updateUser(dto: UpdateSupabaseUserDto) {
    return this.supabase.auth.admin.updateUserById(dto.idSupabaseAuth, {
      email: dto.email,
      password: dto.password,
      role: dto.role ?? 'user',
      email_confirm: dto.emailConfirmed ?? true,
      user_metadata: dto.userMetadata,
      app_metadata: dto.appMetadata,
    });
  }
}
