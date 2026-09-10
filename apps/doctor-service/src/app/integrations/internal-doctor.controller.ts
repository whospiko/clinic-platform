import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { DoctorIntegrationService } from './doctor-integration.service';
class CanBookQuery {
  @IsOptional() @IsUUID() clinicId?: string;
}
@ApiTags('Internal - Doctor Integration')
@Controller('internal/doctors')
export class InternalDoctorController {
  constructor(private readonly service: DoctorIntegrationService) {}
  @Get(':id/booking-profile')
  @ApiOperation({
    summary:
      'Read model for booking-service; protect this route with service auth in production',
  })
  profile(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.bookingProfile(id);
  }
  @Get(':id/can-book')
  @ApiOperation({
    summary: 'Lightweight doctor/clinic validation for booking-service',
  })
  canBook(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: CanBookQuery,
  ) {
    return this.service.canBook(id, query.clinicId);
  }
}
