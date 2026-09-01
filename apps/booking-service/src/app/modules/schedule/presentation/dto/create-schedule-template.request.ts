import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateScheduleTemplateRequest {
    @ApiPropertyOptional({
        example: '9d4e9ec2-7f5e-4c9c-8db7-2d6c8b8f2a11',
        nullable: true,
        description: 'Optional clinic ID. Use this when the schedule template applies only to one clinic branch.',
    })
    @IsOptional()
    @IsUUID()
    clinicId?: string | null;

    @ApiProperty({
        example: 'Asia/Phnom_Penh',
        description: 'Timezone used for this schedule template',
    })
    @IsString()
    timezone!: string;

    @ApiProperty({
        example: '2026-09-02',
        description: 'Date when this schedule template becomes effective in ISO 8601 date format',
    })
    @IsDateString()
    effectiveFrom!: string;

    @ApiPropertyOptional({
        example: '2026-12-31',
        nullable: true,
        description: 'Optional date when this schedule template stops being effective in ISO 8601 date format',
    })
    @IsOptional()
    @IsDateString()
    effectiveTo?: string | null;
}