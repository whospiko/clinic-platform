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

import { CreatePatientContactCommand } from '../application/commands/create-patient-contact.command';
import { DeletePatientContactCommand } from '../application/commands/delete-patient-contact.command';
import { SetPrimaryPatientContactCommand } from '../application/commands/set-primary-patient-contact.command';
import { UpdatePatientContactCommand } from '../application/commands/update-patient-contact.command';
import { PatientContactReadModel } from '../application/dto/patient-contact-read-model';
import { ListPatientContactsQuery } from '../application/queries/list-patient-contacts.query';
import { CreatePatientContactRequest } from './dto/create-patient-contact.request';
import { UpdatePatientContactRequest } from './dto/update-patient-contact.request';

@ApiTags('Patient Contacts')
@Controller()
export class PatientContactController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('patients/:patientId/contacts')
  @ApiOperation({ summary: 'Create patient contact' })
  @ApiCreatedResponse({ description: 'Contact created' })
  create(
    @Param('patientId') patientId: string,
    @Body() body: CreatePatientContactRequest,
  ): Promise<PatientContactReadModel> {
    return this.commandBus.execute(
      new CreatePatientContactCommand(patientId, body),
    );
  }

  @Get('patients/:patientId/contacts')
  @ApiOperation({ summary: 'List patient contacts' })
  @ApiOkResponse({ description: 'Patient contacts' })
  list(
    @Param('patientId') patientId: string,
  ): Promise<PatientContactReadModel[]> {
    return this.queryBus.execute(new ListPatientContactsQuery(patientId));
  }

  @Patch('patient-contacts/:id')
  @ApiOperation({ summary: 'Update patient contact' })
  update(
    @Param('id') id: string,
    @Body() body: UpdatePatientContactRequest,
  ): Promise<PatientContactReadModel> {
    return this.commandBus.execute(new UpdatePatientContactCommand(id, body));
  }

  @Patch('patients/:patientId/contacts/:id/primary')
  @ApiOperation({ summary: 'Set patient primary contact' })
  setPrimary(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ): Promise<PatientContactReadModel> {
    return this.commandBus.execute(
      new SetPrimaryPatientContactCommand(patientId, id),
    );
  }

  @Delete('patient-contacts/:id')
  @ApiOperation({ summary: 'Delete patient contact' })
  delete(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.commandBus.execute(new DeletePatientContactCommand(id));
  }
}
