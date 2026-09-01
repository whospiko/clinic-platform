import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateScheduleTemplateRequest } from './dto/create-schedule-template.request';
import { AddWorkingWindowRequest } from './dto/add-working-window.request';
import { AddBreakTimeRequest } from './dto/add-break-time.request';
import { CreateScheduleOverrideRequest } from './dto/create-schedule-override.request';

import { CreateScheduleTemplateCommand } from '../application/commands/create-schedule-template.command';
import { AddWorkingWindowCommand } from '../application/commands/add-working-window.command';
import { AddBreakTimeCommand } from '../application/commands/add-break-time.command';
import { CreateScheduleOverrideCommand } from '../application/commands/create-schedule-override.command';
import { DeleteScheduleOverrideCommand } from '../application/commands/delete-schedule-override.command';

import {
    ScheduleReaderPort,
    SCHEDULE_READER_PORT,
} from '../application/ports/schedule-reader.port';

@Controller('schedules')
export class DoctorScheduleController {
    constructor(
        private readonly commandBus: CommandBus,

        @Inject(SCHEDULE_READER_PORT)
        private readonly scheduleReader: ScheduleReaderPort,
    ) { }

    @Post('doctors/:doctorId/templates')
    async createTemplate(
        @Param('doctorId') doctorId: string,
        @Body() body: CreateScheduleTemplateRequest,
    ): Promise<{ id: string }> {
        return this.commandBus.execute(
            new CreateScheduleTemplateCommand(
                doctorId,
                body.clinicId ?? null,
                body.timezone,
                body.effectiveFrom,
                body.effectiveTo ?? null,
            ),
        );
    }

    @Post('templates/:templateId/working-windows')
    async addWorkingWindow(
        @Param('templateId') templateId: string,
        @Body() body: AddWorkingWindowRequest,
    ): Promise<{ id: string }> {
        return this.commandBus.execute(
            new AddWorkingWindowCommand(
                templateId,
                body.dayOfWeek,
                body.startTime,
                body.endTime,
                body.slotDurationMinutes,
                body.capacity,
            ),
        );
    }

    @Post('templates/:templateId/break-times')
    async addBreakTime(
        @Param('templateId') templateId: string,
        @Body() body: AddBreakTimeRequest,
    ): Promise<{ id: string }> {
        return this.commandBus.execute(
            new AddBreakTimeCommand(
                templateId,
                body.dayOfWeek,
                body.startTime,
                body.endTime,
                body.reason ?? null,
            ),
        );
    }

    @Post('doctors/:doctorId/overrides')
    async createOverride(
        @Param('doctorId') doctorId: string,
        @Body() body: CreateScheduleOverrideRequest,
    ): Promise<{ id: string }> {
        return this.commandBus.execute(
            new CreateScheduleOverrideCommand(
                doctorId,
                body.clinicId ?? null,
                body.date,
                body.type,
                body.startTime ?? null,
                body.endTime ?? null,
                body.reason ?? null,
            ),
        );
    }

    @Delete('overrides/:overrideId')
    @HttpCode(204)
    async deleteOverride(@Param('overrideId') overrideId: string): Promise<void> {
        await this.commandBus.execute(new DeleteScheduleOverrideCommand(overrideId));
    }

    @Get('doctors/:doctorId')
    async getDoctorSchedule(@Param('doctorId') doctorId: string) {
        return this.scheduleReader.getDoctorSchedule(doctorId);
    }

    @Get('doctors/:doctorId/overrides')
    async getDoctorOverrides(
        @Param('doctorId') doctorId: string,
        @Query('from') from?: string,
        @Query('to') to?: string,
    ) {
        return this.scheduleReader.getDoctorOverrides(doctorId, from, to);
    }
}