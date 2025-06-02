import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseClientProvider } from './supabase.provider';

@Global() // opcional, se quiser singleton global
@Module({
  imports: [ConfigModule],
  providers: [SupabaseClientProvider],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
