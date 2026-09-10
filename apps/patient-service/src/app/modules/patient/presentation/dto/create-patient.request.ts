import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Gender } from '../../domain/gender.enum';

export class CreatePatientRequest {
  @ApiProperty({ example: 'PT-000001' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Dara' })
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiPropertyOptional({ example: 'Sok' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string | null;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: '2001-05-20' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string | null;

  @ApiPropertyOptional({ example: '+85512345678' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string | null;

  @ApiPropertyOptional({ example: 'dara@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string | null;

  @ApiPropertyOptional({ example: '010123456' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nationalId?: string | null;

  @ApiPropertyOptional({ example: 'Prefers evening appointments' })
  @IsOptional()
  @IsString()
  remark?: string | null;
}
