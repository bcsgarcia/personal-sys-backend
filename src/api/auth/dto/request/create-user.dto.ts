// src/supabase/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AppMetadataDto {
  @ApiProperty({
    description: 'Client active or not',
    example: true,
    type: Boolean,
  })
  enabled: boolean;
}

export class UserMetadataDto {
  @ApiProperty({
    description: 'Client ID',
    example: '1234567890',
    type: String,
  })
  clientId: string;

  @ApiProperty({
    description: 'Authentication ID',
    example: '99999999999',
    type: String,
  })
  clientIdAuth: string;

  @ApiProperty({
    description: 'Company ID',
    example: '36478346278623784',
    type: String,
  })
  idCompany: string;

  @ApiProperty({
    description: 'Client Name',
    example: 'Bob esponja',
    type: String,
  })
  clientName: string;
}

export class CreateSupabaseUserDto {
  @ApiProperty({
    description: 'client email',
    example: 'test@test.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Client password',
    example: '******',
    type: String,
  })
  password: string;

  @ApiProperty({
    description: 'The name of the client',
    example: 'Bob Esponja',
    type: String,
  })
  emailConfirmed?: boolean;

  @ApiProperty({
    description: 'Client ID',
    example: '1234567890',
    type: AppMetadataDto,
  })
  appMetadata: AppMetadataDto;

  @ApiProperty({
    description: 'Client ID',
    example: '1234567890',
    type: UserMetadataDto,
  })
  userMetadata: UserMetadataDto;

  @ApiProperty({
    description: 'Client role',
    example: 'user',
    type: String,
  })
  role?: string;
}

export class UpdateSupabaseUserDto extends CreateSupabaseUserDto {
  @ApiProperty({
    description: 'Client ID',
    example: '1234567890',
    type: String,
  })
  idSupabaseAuth: string;
}
