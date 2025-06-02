// src/supabase/dto/create-user.dto.ts
export class CreateUserDto {
  email: string;
  password: string;
  emailConfirmed?: boolean; // opcional
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
  role?: string;
}
