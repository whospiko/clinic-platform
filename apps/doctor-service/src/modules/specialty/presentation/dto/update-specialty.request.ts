import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateSpecialtyRequest } from './create-specialty.request';

export class UpdateSpecialtyRequest extends PartialType(
  OmitType(CreateSpecialtyRequest, ['code'] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
