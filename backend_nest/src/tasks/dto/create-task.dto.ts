import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'The title of the task'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: false,
    description: 'Whether the task is completed',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
} 