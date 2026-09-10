import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { CredentialType } from '../../domain/credential-type.enum';
export class CreateDoctorCredentialRequest {
  @ApiProperty({ enum: CredentialType })
  @IsEnum(CredentialType)
  type!: CredentialType;
  @ApiProperty() @IsString() @MaxLength(100) credentialNumber!: string;
  @ApiProperty() @IsString() @MaxLength(190) issuer!: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() issuedAt?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiresAt?:
    | string
    | null;
  @ApiPropertyOptional() @IsOptional() @IsUrl() documentUrl?: string | null;
}
