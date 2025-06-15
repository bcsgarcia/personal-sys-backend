import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const SupabaseClientProvider: Provider = {
  provide: 'SUPABASE_CLIENT',
  useFactory: (
    config: ConfigService,
  ): SupabaseClient<any, 'personal_sys', any> => {
    const url = config.get<string>('SUPABASE_URL');
    const key = config.get<string>('SUPABASE_KEY');
    const client = createClient(url, key, {
      db: {
        schema: 'personal_sys',
      },
    });

    return client;
  },
  inject: [ConfigService],
};
