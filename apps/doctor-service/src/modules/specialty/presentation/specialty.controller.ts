import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SpecialtyService } from '../application/specialty.service';
import { CreateSpecialtyRequest } from './dto/create-specialty.request';
import { UpdateSpecialtyRequest } from './dto/update-specialty.request';
@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly service: SpecialtyService) {}
  @Post() create(@Body() body: CreateSpecialtyRequest) {
    return this.service.create(body);
  }
  @Get() @ApiQuery({ name: 'active', required: false, type: Boolean }) list(
    @Query('active', new ParseBoolPipe({ optional: true })) active?: boolean,
  ) {
    return this.service.list(active);
  }
  @Get(':id') get(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.get(id);
  }
  @Patch(':id') update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSpecialtyRequest,
  ) {
    return this.service.update(id, body);
  }
  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT) remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.remove(id);
  }
}
