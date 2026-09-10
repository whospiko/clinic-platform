import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePatientEmergencyContactRequest {
  @ApiProperty({ example: 'Sok Sophea' })
  @IsString()
  @MaxLength(180)
  fullName!: string;

  @ApiProperty({ example: 'Mother' })
  @IsString()
  @MaxLength(80)
  relationship!: string;

  @ApiProperty({ example: '+85598765432' })
  @IsString()
  @MaxLength(30)
  phone!: string;

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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
