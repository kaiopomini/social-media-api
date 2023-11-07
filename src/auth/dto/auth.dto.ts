import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
