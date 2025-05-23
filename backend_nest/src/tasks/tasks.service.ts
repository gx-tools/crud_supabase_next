import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MESSAGES, TABLES } from '../helpers/string-const';
import { IApiResponse, successResponse } from '../helpers/response.helper';

@Injectable()
export class TasksService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createTaskDto: CreateTaskDto, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .insert({
          title: createTaskDto.title,
          completed: createTaskDto.completed || false,
        })
        .select()
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.TASK_CREATED, data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.TASKS_RETRIEVED, data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw new NotFoundException(MESSAGES.TASK_NOT_FOUND);
      }

      return successResponse(MESSAGES.TASK_RETRIEVED, data);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      // First check if task exists and belongs to user
      await this.findOne(id, userId, accessToken);

      const { data, error } = await supabase
        .from(TABLES.TASKS)
        .update(updateTaskDto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.TASK_UPDATED, data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      // First check if task exists and belongs to user
      await this.findOne(id, userId, accessToken);

      const { error } = await supabase
        .from(TABLES.TASKS)
        .delete()
        .eq('id', id);

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.TASK_DELETED);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
