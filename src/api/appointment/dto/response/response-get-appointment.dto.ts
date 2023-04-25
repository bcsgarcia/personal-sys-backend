import { ApiProperty } from '@nestjs/swagger';
import { ClientDto } from 'src/api/client/dto/client.dto';

export const appointmentWithClientResponseDto = generateExample();

export class AppointmentResponseDto {
  @ApiProperty({ description: 'Appointment ID', type: String })
  id: string;

  @ApiProperty({ description: 'Is appointment active?', type: Boolean })
  isActive: boolean;

  @ApiProperty({ description: 'Last update timestamp', type: Date })
  lastUpdate: Date;

  @ApiProperty({
    description: 'Appointment start date',
    type: Date,
    nullable: true,
  })
  appointmentStartDate: Date | null;

  @ApiProperty({
    description: 'Appointment end date',
    type: Date,
    nullable: true,
  })
  appointmentEndDate: Date | null;

  @ApiProperty({ description: 'Appointment title', type: String })
  title: string;

  @ApiProperty({ description: 'Appointment description', type: String })
  description: string;

  @ApiProperty({
    description: 'Personal observation (informacoes pessoais)',
    type: String,
  })
  personalObservation: string;

  @ApiProperty({ description: 'Is appointment done?', type: Boolean })
  isDone: boolean;

  @ApiProperty({ description: 'Client ID', type: String, nullable: true })
  idClient: string | null;

  @ApiProperty({ description: 'Company ID', type: String })
  idCompany: string;
}

export class AppointmentWithClientResponseDto extends AppointmentResponseDto {
  clients: ClientDto[];
}

function generateExample(): AppointmentWithClientResponseDto[] {
  return [
    {
      id: '5df5f113-d7b5-11ed-ba77-0242ac110002',
      isActive: true,
      lastUpdate: new Date('2023-04-13T15:29:00.000Z'),
      appointmentStartDate: new Date('2023-04-13T15:43:04.000Z'),
      appointmentEndDate: new Date('2023-04-13T16:43:04.000Z'),
      title: 'Dermato Appointment',
      description: 'lotem lotem lotem lporem',
      personalObservation: 'mostrar pescoço',
      isDone: false,
      idClient: null,
      idCompany: '7c576f1d-d78e-11ed-ba77-0242ac110002',
      clients: [
        {
          id: 'e64e793b-d7af-11ed-ba77-0242ac110002',
          isActive: '1',
          name: 'Patrick Star',
          email: 'patrickstar@rockmail.com',
          birthday: new Date('1988-10-17T00:00:00.000Z'),
          gender: 'm',
          idCompany: '7c576f1d-d78e-11ed-ba77-0242ac110002',
          phone: '88888888888',
          photoUrl: null,
        },
      ],
    },
  ];
}
