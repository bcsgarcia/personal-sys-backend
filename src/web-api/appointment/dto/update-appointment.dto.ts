

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateAppointmentDto {
    @ApiProperty({
        description: 'Appointment start date',
        type: Date,
        required: false,
    })
    @IsOptional()
    appointmentStartDate?: Date | null;

    @ApiProperty({
        description: 'Appointment end date',
        type: Date,
        required: false,
    })
    @IsOptional()
    appointmentEndDate?: Date | null;

    @ApiProperty({
        description: 'Appointment title',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Appointment description',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Personal observation',
        type: String,
        required: false,
        example: 'informacoes pessoais',
    })
    @IsOptional()
    @IsString()
    personalObservation?: string;

    @ApiProperty({
        description: 'Appointment completion status',
        type: Boolean,
        default: false,
    })
    @IsBoolean()
    isDone: boolean;

    @ApiProperty({
        description: 'Client ID',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsUUID()
    idClient?: string;

    @ApiHideProperty()
    idCompany: string;

    @ApiProperty({
        description: 'If you want to send a notification to any client regarding the appointment',
        type: Array<String>,
        required: false,
    })
    @IsOptional()
    idClients: string[]
}
