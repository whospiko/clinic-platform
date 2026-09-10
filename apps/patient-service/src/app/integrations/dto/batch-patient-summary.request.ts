import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class BatchPatientSummaryRequest {
  @ApiProperty({
    example: ['2b1e8c84-6f3d-40ff-9615-2968ba8f8cb3'],
    description:
      'Patient ids requested by another service, such as booking-service.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  ids!: string[];
}
