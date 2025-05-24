import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { AccessToken } from '../common/decorators/access-token.decorator';
import { ROUTES } from '../helpers/string-const';
import { IApiResponse } from '../helpers/response.helper';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller(ROUTES.TASKS)
@UseGuards(AuthGuard)
@ApiCookieAuth()
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 500 },
      message: { type: 'string', example: 'Internal server error' },
      error: { type: 'string', example: 'Internal Server Error' }
    }
  }
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new task',
    description: 'Creates a new task for the authenticated user. The task requires a title and can optionally be marked as completed.'
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Task successfully created',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Task created successfully' },
        data: {
          type: 'object',
          properties: {
            task: { 
              type: 'object',
              properties: {
                id: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' },
                title: { type: 'string', example: 'Complete project documentation' },
                completed: { type: 'boolean', example: false },
                user_id: { type: 'string', example: 'u1v2w3x4-y5z6-7a8b-9c0d-e1f2g3h4i5j6' },
                created_at: { type: 'string', format: 'date-time', example: '2023-01-15T14:30:00.000Z' },
                updated_at: { type: 'string', format: 'date-time', example: '2023-01-15T14:30:00.000Z' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid task data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  async create(
    @Body() createTaskDto: CreateTaskDto, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.create(createTaskDto, userId, accessToken);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all tasks',
    description: 'Retrieves all tasks belonging to the authenticated user.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all tasks',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Tasks retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            tasks: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' },
                  title: { type: 'string', example: 'Complete project documentation' },
                  completed: { type: 'boolean', example: false },
                  user_id: { type: 'string', example: 'u1v2w3x4-y5z6-7a8b-9c0d-e1f2g3h4i5j6' },
                  created_at: { type: 'string', format: 'date-time', example: '2023-01-15T14:30:00.000Z' },
                  updated_at: { type: 'string', format: 'date-time', example: '2023-01-15T14:30:00.000Z' }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated' })
  async findAll(
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.findAll(userId, accessToken);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a task by ID',
    description: 'Retrieves a specific task by its ID. The task must belong to the authenticated user.'
  })
  @ApiParam({ name: 'id', description: 'Unique identifier of the task', required: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the task',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Task retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            task: { 
              type: 'object',
              properties: {
                id: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' },
                title: { type: 'string', example: 'Complete project documentation' },
                completed: { type: 'boolean', example: false },
                user_id: { type: 'string', example: 'u1v2w3x4-y5z6-7a8b-9c0d-e1f2g3h4i5j6' },
                created_at: { type: 'string', format: 'date-time', example: '2023-01-15T14:30:00.000Z' },
                updated_at: { type: 'string', format: 'date-time', example: '2023-01-15T14:30:00.000Z' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated or task belongs to another user' })
  async findOne(
    @Param('id') id: string, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.findOne(id, userId, accessToken);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update a task',
    description: 'Updates an existing task with the provided data. The task must belong to the authenticated user.'
  })
  @ApiParam({ name: 'id', description: 'Unique identifier of the task to update', required: true })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Task successfully updated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Task updated successfully' },
        data: {
          type: 'object',
          properties: {
            task: { 
              type: 'object',
              properties: {
                id: { type: 'string', example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6' },
                title: { type: 'string', example: 'Updated project documentation' },
                completed: { type: 'boolean', example: true },
                user_id: { type: 'string', example: 'u1v2w3x4-y5z6-7a8b-9c0d-e1f2g3h4i5j6' },
                created_at: { type: 'string', format: 'date-time', example: '2023-01-15T14:30:00.000Z' },
                updated_at: { type: 'string', format: 'date-time', example: '2023-01-15T15:45:00.000Z' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid task data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated or task belongs to another user' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.update(id, updateTaskDto, userId, accessToken);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a task',
    description: 'Deletes a task by its ID. The task must belong to the authenticated user.'
  })
  @ApiParam({ name: 'id', description: 'Unique identifier of the task to delete', required: true })
  @ApiResponse({ 
    status: 200, 
    description: 'Task successfully deleted',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Task deleted successfully' },
        data: { type: 'null', example: null }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - User not authenticated or task belongs to another user' })
  async remove(
    @Param('id') id: string, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.remove(id, userId, accessToken);
  }
}
