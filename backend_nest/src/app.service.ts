import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}
  
  getHello(): string {
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('Supabase Client:', this.supabaseService.getClient() ? 'Initialized' : 'Not initialized');
    return 'Hello World!';
  }
}
