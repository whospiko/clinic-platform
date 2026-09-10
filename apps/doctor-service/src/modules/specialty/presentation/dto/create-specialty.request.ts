import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateSpecialtyRequest {
  @ApiProperty({ example: 'ORTHO' }) @IsString() @MaxLength(50) code!: string;
  @ApiProperty({ example: 'Orthodontics' })
  @IsString()
  @MaxLength(150)
  name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string | null;
}
