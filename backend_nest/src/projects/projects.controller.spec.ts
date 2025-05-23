import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { SupabaseService } from '../supabase/supabase.service';

// Mock the AuthGuard
jest.mock('../common/guards/auth.guard');

// Mock the ProjectsService
const mockProjectsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock the SupabaseService
const mockSupabaseService = {
  getClient: jest.fn(),
  getAuthenticatedClient: jest.fn(),
};

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn().mockReturnValue(true) })
    .compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
}); 