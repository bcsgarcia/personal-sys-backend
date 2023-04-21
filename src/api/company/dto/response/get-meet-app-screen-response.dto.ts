import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AboutCompanyDto, TestimonyDto } from './response';

export class GetMeetAppScreenResponseDto {
    @ApiProperty({ description: 'Information about the company', type: AboutCompanyDto })
    @IsNotEmpty()
    @ValidateNested()
    aboutCompany: AboutCompanyDto;

    @ApiProperty({ description: 'List of testimonies', type: [TestimonyDto] })
    @IsArray()
    @ValidateNested({ each: true })
    testemonies: TestimonyDto[];

    @ApiProperty({ description: 'List of URLs of photos before and after', type: [String] })
    @IsArray()
    @IsString({ each: true })
    photosBeforeAndAfter: string[];
}