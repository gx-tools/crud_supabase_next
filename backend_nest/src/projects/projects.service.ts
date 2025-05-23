import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { MESSAGES, TABLES } from '../helpers/string-const';
import { IApiResponse, successResponse } from '../helpers/response.helper';

@Injectable()
export class ProjectsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createProjectDto: CreateProjectDto, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert({
          title: createProjectDto.title,
          // created_by: userId,
        })
        .select()
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.PROJECT_CREATED, data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.PROJECTS_RETRIEVED, data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        throw new NotFoundException(MESSAGES.PROJECT_NOT_FOUND);
      }

      return successResponse(MESSAGES.PROJECT_RETRIEVED, data);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      // First check if project exists and belongs to user
      await this.findOne(id, userId, accessToken);

      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update(updateProjectDto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.PROJECT_UPDATED, data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string, userId: string, accessToken: string): Promise<IApiResponse> {
    try {
      const supabase = this.supabaseService.getAuthenticatedClient(accessToken);
      
      // First check if project exists and belongs to user
      await this.findOne(id, userId, accessToken);

      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', id);

      if (error) {
        throw new BadRequestException(error.message);
      }

      return successResponse(MESSAGES.PROJECT_DELETED);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
} 