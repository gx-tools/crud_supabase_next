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
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createTaskDto: CreateTaskDto, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.create(createTaskDto, userId, accessToken);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.findAll(userId, accessToken);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Return the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Param('id') id: string, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.findOne(id, userId, accessToken);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.update(id, updateTaskDto, userId, accessToken);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(
    @Param('id') id: string, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.tasksService.remove(id, userId, accessToken);
  }
}
