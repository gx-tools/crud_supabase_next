import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENVS } from '../helpers/string-const';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private supabaseUrl: string | undefined;
  private supabaseAnonKey: string | undefined;

  onModuleInit() {
    this.supabaseUrl = process.env[ENVS.SUPABASE_URL];
    this.supabaseAnonKey = process.env[ENVS.SUPABASE_ANON_KEY];

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return;
    }

    this.supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAuthenticatedClient(accessToken: string): SupabaseClient {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    return createClient(
      this.supabaseUrl,
      this.supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      }
    );
  }
} 