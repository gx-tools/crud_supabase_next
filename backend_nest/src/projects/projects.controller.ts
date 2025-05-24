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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';
import { AccessToken } from '../common/decorators/access-token.decorator';
import { ROUTES } from '../helpers/string-const';
import { IApiResponse } from '../helpers/response.helper';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller(ROUTES.PROJECTS)
@UseGuards(AuthGuard)
@ApiCookieAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createProjectDto: CreateProjectDto, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.projectsService.create(createProjectDto, userId, accessToken);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.projectsService.findAll(userId, accessToken);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Return the project' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Param('id') id: string, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.projectsService.findOne(id, userId, accessToken);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({ type: UpdateProjectDto })
  @ApiResponse({ status: 200, description: 'Project successfully updated' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.projectsService.update(id, updateProjectDto, userId, accessToken);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project successfully deleted' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(
    @Param('id') id: string, 
    @User('id') userId: string,
    @AccessToken() accessToken: string
  ): Promise<IApiResponse> {
    return this.projectsService.remove(id, userId, accessToken);
  }
} 