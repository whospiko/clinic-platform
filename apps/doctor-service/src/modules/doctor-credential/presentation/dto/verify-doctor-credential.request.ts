import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class VerifyDoctorCredentialRequest {
  @ApiProperty() @IsBoolean() approved!: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string | null;
}
