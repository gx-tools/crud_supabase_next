import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { MESSAGES, TABLES } from '../helpers/string-const';
import { IApiResponse, successResponse } from '../helpers/response.helper';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserInfo(userId: string): Promise<IApiResponse> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from(TABLES.USERS)
        .select('email, role')
        .eq('id', userId)
        .single();

      if (error || !data) {
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      }

      return successResponse(MESSAGES.USER_RETRIEVED, {
        email: data.email,
        role: data.role
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
} 