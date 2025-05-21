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
import { ROUTES } from '../helpers/string-const';
import { IApiResponse } from '../helpers/response.helper';

@Controller(ROUTES.TASKS)
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @User('id') userId: string): Promise<IApiResponse> {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  async findAll(@User('id') userId: string): Promise<IApiResponse> {
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User('id') userId: string): Promise<IApiResponse> {
    return this.tasksService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User('id') userId: string,
  ): Promise<IApiResponse> {
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User('id') userId: string): Promise<IApiResponse> {
    return this.tasksService.remove(id, userId);
  }
}
