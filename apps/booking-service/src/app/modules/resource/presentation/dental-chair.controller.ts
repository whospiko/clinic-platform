import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

import { CreateDentalChairCommand } from '../application/commands/create-dental-chair.command';
import { UpdateDentalChairCommand } from '../application/commands/update-dental-chair.command';
import { ChangeDentalChairStatusCommand } from '../application/commands/change-dental-chair-status.command';
import { DentalChairReadModel } from '../application/dto/dental-chair-read-model';
import { ResourceReaderPort } from '../application/ports/resource-reader.port';
import { DentalChairStatus } from '../domain/dental-chair-status.enum';

import { CreateDentalChairRequest } from './dto/create-dental-chair.request';
import { UpdateDentalChairRequest } from './dto/update-dental-chair.request';
import { ChangeDentalChairStatusRequest } from './dto/change-dental-chair-status.request';

@ApiTags('Dental Chairs')
@Controller('resources/dental-chairs')
export class DentalChairController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly resourceReader: ResourceReaderPort,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Create dental chair',
    })
    @ApiCreatedResponse({
        type: DentalChairReadModel,
    })
    async create(
        @Body() request: CreateDentalChairRequest,
    ): Promise<DentalChairReadModel> {
        return this.commandBus.execute(
            new CreateDentalChairCommand(
                request.clinicId ?? null,
                request.code,
                request.name,
                request.description ?? null,
                request.status,
            ),
        );
    }

    @Get()
    @ApiOperation({
        summary: 'List dental chairs',
    })
    @ApiQuery({
        name: 'clinicId',
        required: false,
    })
    @ApiQuery({
        name: 'status',
        enum: DentalChairStatus,
        required: false,
    })
    @ApiOkResponse({
        type: DentalChairReadModel,
        isArray: true,
    })
    async findMany(
        @Query('clinicId') clinicId?: string,
        @Query('status') status?: DentalChairStatus,
    ): Promise<DentalChairReadModel[]> {
        return this.resourceReader.findDentalChairs({
            clinicId,
            status,
        });
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get dental chair by ID',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiOkResponse({
        type: DentalChairReadModel,
    })
    async findOne(@Param('id') id: string): Promise<DentalChairReadModel> {
        const chair = await this.resourceReader.findDentalChairById(id);

        if (!chair) {
            throw new NotFoundException('Dental chair not found.');
        }

        return chair;
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update dental chair',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiOkResponse({
        type: DentalChairReadModel,
    })
    async update(
        @Param('id') id: string,
        @Body() request: UpdateDentalChairRequest,
    ): Promise<DentalChairReadModel> {
        return this.commandBus.execute(
            new UpdateDentalChairCommand(
                id,
                request.code,
                request.name,
                request.description,
            ),
        );
    }

    @Patch(':id/status')
    @ApiOperation({
        summary: 'Change dental chair status',
    })
    @ApiParam({
        name: 'id',
    })
    @ApiOkResponse({
        type: DentalChairReadModel,
    })
    async changeStatus(
        @Param('id') id: string,
        @Body() request: ChangeDentalChairStatusRequest,
    ): Promise<DentalChairReadModel> {
        return this.commandBus.execute(
            new ChangeDentalChairStatusCommand(id, request.status),
        );
    }
}