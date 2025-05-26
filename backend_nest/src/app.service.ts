import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}
  
  getHello(): string {
    
    if(!process.env.FRONTEND_URL) {
      throw new Error('FRONTEND_URL is not defined');
    }
    
    return process.env.FRONTEND_URL!;
  }
}
