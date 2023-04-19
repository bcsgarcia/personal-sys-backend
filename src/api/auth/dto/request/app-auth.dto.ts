import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AppAuthDto {
    @ApiProperty({
        description: 'Login',
        example: 'tommystarfish@kelpshake.com',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password',
        example: 'kelpShake*2023',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

}
