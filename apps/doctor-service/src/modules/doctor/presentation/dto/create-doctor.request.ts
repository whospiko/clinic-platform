import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { DoctorGender } from '../../domain/doctor-gender.enum';

export class CreateDoctorRequest {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Identity-service user id',
  })
  @IsOptional()
  @IsUUID()
  userId?: string | null;
  @ApiProperty({ example: 'DR-0001' }) @IsString() employeeCode!: string;
  @ApiProperty({ example: 'Sok' }) @IsString() firstName!: string;
  @ApiProperty({ example: 'Dara' }) @IsString() lastName!: string;
  @ApiPropertyOptional({ example: 'Dr. Sok Dara' })
  @IsOptional()
  @IsString()
  displayName?: string;
  @ApiProperty({ enum: DoctorGender, example: DoctorGender.MALE })
  @IsEnum(DoctorGender)
  gender!: DoctorGender;
  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string | null;
  @ApiPropertyOptional({ example: '+85512345678' })
  @IsOptional()
  @IsString()
  phone?: string | null;
  @ApiPropertyOptional({ example: 'doctor@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() bio?: string | null;
  @ApiPropertyOptional({ default: 0, minimum: 0, maximum: 80 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(80)
  yearsExperience?: number;
}
