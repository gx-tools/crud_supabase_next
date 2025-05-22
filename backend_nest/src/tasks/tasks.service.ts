import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MESSAGES, TABLES } from '../helpers/string-const';
import { IApiResponse, successResponse } from '../helpers/response.helper';

@Injectable()
export class TasksService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<IApiResponse> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from(TABLES.TASKS)
        .insert({
          title: createTaskDto.title,
          completed: createTaskDto.completed || false,
          created_by: userId,
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

  async findAll(userId: string): Promise<IApiResponse> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
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

  async findOne(id: string, userId: string): Promise<IApiResponse> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
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

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<IApiResponse> {
    try {
      // First check if task exists and belongs to user
      await this.findOne(id, userId);

      const { data, error } = await this.supabaseService
        .getClient()
        .from(TABLES.TASKS)
        .update(updateTaskDto)
        .eq('id', id)
        .eq('created_by', userId)
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

  async remove(id: string, userId: string): Promise<IApiResponse> {
    try {
      // First check if task exists and belongs to user
      await this.findOne(id, userId);

      const { error } = await this.supabaseService
        .getClient()
        .from(TABLES.TASKS)
        .delete()
        .eq('id', id)
        .eq('created_by', userId);

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.TASK_DELETED);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
