import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { CreateAppointmentHoldCommand } from '../application/commands/create-appointment-hold.command';
import { ConfirmAppointmentHoldCommand } from '../application/commands/confirm-appointment-hold.command';
import { CancelAppointmentHoldCommand } from '../application/commands/cancel-appointment-hold.command';
import { ExpireAppointmentHoldCommand } from '../application/commands/expire-appointment-hold.command';
import { AppointmentHoldReadModel } from '../application/dto/appointment-hold-read-model';
import { CreateAppointmentHoldRequest } from './dto/create-appointment-hold.request';
import { ConfirmAppointmentHoldRequest } from './dto/confirm-appointment-hold.request';

@ApiTags('Appointment Holds')
@Controller('appointment-holds')
export class AppointmentHoldController {
    constructor(private readonly commandBus: CommandBus) { }

    @Post()
    @ApiOperation({
        summary: 'Create temporary appointment hold',
        description:
            'Temporarily blocks doctor/resource time while patient is confirming the appointment.',
    })
    @ApiCreatedResponse({
        description: 'Appointment hold created.',
    })
    @ApiConflictResponse({
        description: 'The slot is already held or invalid.',
    })
    async create(@Body() body: CreateAppointmentHoldRequest): Promise<AppointmentHoldReadModel> {
        return this.commandBus.execute(
            new CreateAppointmentHoldCommand({
                clinicId: body.clinicId,
                doctorId: body.doctorId,
                patientId: body.patientId,
                resourceId: body.resourceId,
                startAt: body.startAt,
                endAt: body.endAt,
                ttlSeconds: body.ttlSeconds,
                reason: body.reason,
            }),
        );
    }

    @Post(':id/confirm')
    @ApiOperation({
        summary: 'Confirm appointment hold',
        description:
            'Marks the hold as confirmed after appointment module successfully creates the real appointment.',
    })
    @ApiOkResponse({
        description: 'Appointment hold confirmed.',
    })
    @ApiNotFoundResponse({
        description: 'Appointment hold not found.',
    })
    @ApiConflictResponse({
        description: 'Appointment hold cannot be confirmed.',
    })
    async confirm(
        @Param('id') id: string,
        @Body() body: ConfirmAppointmentHoldRequest,
    ): Promise<AppointmentHoldReadModel> {
        return this.commandBus.execute(new ConfirmAppointmentHoldCommand(id, body.appointmentId));
    }

    @Post(':id/cancel')
    @ApiOperation({
        summary: 'Cancel appointment hold',
        description: 'Cancels an active hold when patient leaves checkout or changes selected slot.',
    })
    @ApiOkResponse({
        description: 'Appointment hold cancelled.',
    })
    @ApiNotFoundResponse({
        description: 'Appointment hold not found.',
    })
    async cancel(@Param('id') id: string): Promise<AppointmentHoldReadModel> {
        return this.commandBus.execute(new CancelAppointmentHoldCommand(id));
    }

    @Post(':id/expire')
    @ApiOperation({
        summary: 'Expire appointment hold',
        description: 'Expires a hold after its expiration time has passed.',
    })
    @ApiOkResponse({
        description: 'Appointment hold expired.',
    })
    @ApiNotFoundResponse({
        description: 'Appointment hold not found.',
    })
    @ApiConflictResponse({
        description: 'Appointment hold is not expired yet.',
    })
    async expire(@Param('id') id: string): Promise<AppointmentHoldReadModel> {
        return this.commandBus.execute(new ExpireAppointmentHoldCommand(id));
    }
}