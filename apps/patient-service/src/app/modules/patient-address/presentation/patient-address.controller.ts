import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreatePatientAddressCommand } from '../application/commands/create-patient-address.command';
import { DeletePatientAddressCommand } from '../application/commands/delete-patient-address.command';
import { SetPrimaryPatientAddressCommand } from '../application/commands/set-primary-patient-address.command';
import { UpdatePatientAddressCommand } from '../application/commands/update-patient-address.command';
import { PatientAddressReadModel } from '../application/dto/patient-address-read-model';
import { ListPatientAddressesQuery } from '../application/queries/list-patient-addresses.query';
import { CreatePatientAddressRequest } from './dto/create-patient-address.request';
import { UpdatePatientAddressRequest } from './dto/update-patient-address.request';

@ApiTags('Patient Addresses')
@Controller()
export class PatientAddressController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('patients/:patientId/addresses')
  @ApiOperation({ summary: 'Create patient address' })
  @ApiCreatedResponse({ description: 'Address created' })
  create(
    @Param('patientId') patientId: string,
    @Body() body: CreatePatientAddressRequest,
  ): Promise<PatientAddressReadModel> {
    return this.commandBus.execute(
      new CreatePatientAddressCommand(patientId, body),
    );
  }

  @Get('patients/:patientId/addresses')
  @ApiOperation({ summary: 'List patient addresses' })
  @ApiOkResponse({ description: 'Patient addresses' })
  list(
    @Param('patientId') patientId: string,
  ): Promise<PatientAddressReadModel[]> {
    return this.queryBus.execute(new ListPatientAddressesQuery(patientId));
  }

  @Patch('patient-addresses/:id')
  @ApiOperation({ summary: 'Update patient address' })
  update(
    @Param('id') id: string,
    @Body() body: UpdatePatientAddressRequest,
  ): Promise<PatientAddressReadModel> {
    return this.commandBus.execute(new UpdatePatientAddressCommand(id, body));
  }

  @Patch('patients/:patientId/addresses/:id/primary')
  @ApiOperation({ summary: 'Set patient primary address' })
  setPrimary(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ): Promise<PatientAddressReadModel> {
    return this.commandBus.execute(
      new SetPrimaryPatientAddressCommand(patientId, id),
    );
  }

  @Delete('patient-addresses/:id')
  @ApiOperation({ summary: 'Delete patient address' })
  delete(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.commandBus.execute(new DeletePatientAddressCommand(id));
  }
}
