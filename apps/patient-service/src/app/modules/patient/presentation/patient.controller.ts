import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ChangePatientStatusCommand } from '../application/commands/change-patient-status.command';
import { CreatePatientCommand } from '../application/commands/create-patient.command';
import { UpdatePatientCommand } from '../application/commands/update-patient.command';
import { PatientReadModel } from '../application/dto/patient-read-model';
import { GetPatientQuery } from '../application/queries/get-patient.query';
import { ListPatientsQuery } from '../application/queries/list-patients.query';
import { ChangePatientStatusRequest } from './dto/change-patient-status.request';
import { CreatePatientRequest } from './dto/create-patient.request';
import { ListPatientsRequest } from './dto/list-patients.request';
import { UpdatePatientRequest } from './dto/update-patient.request';
import { Paginated } from '../../../shared/pagination/paginated';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a patient profile' })
  @ApiCreatedResponse({ description: 'Patient created' })
  create(@Body() body: CreatePatientRequest): Promise<PatientReadModel> {
    return this.commandBus.execute(new CreatePatientCommand(body));
  }

  @Get()
  @ApiOperation({ summary: 'List patients with filters' })
  @ApiOkResponse({ description: 'Paginated patient list' })
  list(
    @Query() query: ListPatientsRequest,
  ): Promise<Paginated<PatientReadModel>> {
    return this.queryBus.execute(
      new ListPatientsQuery({
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        q: query.q,
        code: query.code,
        phone: query.phone,
        email: query.email,
        gender: query.gender,
        status: query.status,
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by id' })
  get(@Param('id') id: string): Promise<PatientReadModel> {
    return this.queryBus.execute(new GetPatientQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient profile' })
  update(
    @Param('id') id: string,
    @Body() body: UpdatePatientRequest,
  ): Promise<PatientReadModel> {
    return this.commandBus.execute(new UpdatePatientCommand(id, body));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change patient status' })
  changeStatus(
    @Param('id') id: string,
    @Body() body: ChangePatientStatusRequest,
  ): Promise<PatientReadModel> {
    return this.commandBus.execute(
      new ChangePatientStatusCommand(id, body.status),
    );
  }
}
