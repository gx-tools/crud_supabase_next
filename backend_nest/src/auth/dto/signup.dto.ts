import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'The email of the user'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'The password for the account (minimum 6 characters)'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
} 