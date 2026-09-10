import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePatientEmergencyContactRequest {
  @ApiPropertyOptional({ example: 'Sok Sophea' })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  fullName?: string;

  @ApiPropertyOptional({ example: 'Mother' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  relationship?: string;

  @ApiPropertyOptional({ example: '+85598765432' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'sophea@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string | null;

  @ApiPropertyOptional({ example: 'Phnom Penh' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string | null;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
