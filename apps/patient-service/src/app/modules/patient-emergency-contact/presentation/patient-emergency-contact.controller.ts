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

import { CreatePatientEmergencyContactCommand } from '../application/commands/create-patient-emergency-contact.command';
import { DeletePatientEmergencyContactCommand } from '../application/commands/delete-patient-emergency-contact.command';
import { SetPrimaryPatientEmergencyContactCommand } from '../application/commands/set-primary-patient-emergency-contact.command';
import { UpdatePatientEmergencyContactCommand } from '../application/commands/update-patient-emergency-contact.command';
import { PatientEmergencyContactReadModel } from '../application/dto/patient-emergency-contact-read-model';
import { ListPatientEmergencyContactsQuery } from '../application/queries/list-patient-emergency-contacts.query';
import { CreatePatientEmergencyContactRequest } from './dto/create-patient-emergency-contact.request';
import { UpdatePatientEmergencyContactRequest } from './dto/update-patient-emergency-contact.request';

@ApiTags('Patient Emergency Contacts')
@Controller()
export class PatientEmergencyContactController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('patients/:patientId/emergency-contacts')
  @ApiOperation({ summary: 'Create emergency contact' })
  @ApiCreatedResponse({ description: 'Emergency contact created' })
  create(
    @Param('patientId') patientId: string,
    @Body() body: CreatePatientEmergencyContactRequest,
  ): Promise<PatientEmergencyContactReadModel> {
    return this.commandBus.execute(
      new CreatePatientEmergencyContactCommand(patientId, body),
    );
  }

  @Get('patients/:patientId/emergency-contacts')
  @ApiOperation({ summary: 'List emergency contacts' })
  @ApiOkResponse({ description: 'Emergency contacts' })
  list(
    @Param('patientId') patientId: string,
  ): Promise<PatientEmergencyContactReadModel[]> {
    return this.queryBus.execute(
      new ListPatientEmergencyContactsQuery(patientId),
    );
  }

  @Patch('patient-emergency-contacts/:id')
  @ApiOperation({ summary: 'Update emergency contact' })
  update(
    @Param('id') id: string,
    @Body() body: UpdatePatientEmergencyContactRequest,
  ): Promise<PatientEmergencyContactReadModel> {
    return this.commandBus.execute(
      new UpdatePatientEmergencyContactCommand(id, body),
    );
  }

  @Patch('patients/:patientId/emergency-contacts/:id/primary')
  @ApiOperation({ summary: 'Set primary emergency contact' })
  setPrimary(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
  ): Promise<PatientEmergencyContactReadModel> {
    return this.commandBus.execute(
      new SetPrimaryPatientEmergencyContactCommand(patientId, id),
    );
  }

  @Delete('patient-emergency-contacts/:id')
  @ApiOperation({ summary: 'Delete emergency contact' })
  delete(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.commandBus.execute(
      new DeletePatientEmergencyContactCommand(id),
    );
  }
}
