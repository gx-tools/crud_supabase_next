import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'The title of the task. Must be a non-empty string that clearly describes the task.',
    required: true,
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: false,
    description: 'Boolean flag indicating whether the task is completed. Defaults to false if not provided.',
    required: false,
    default: false,
    type: Boolean
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
} 