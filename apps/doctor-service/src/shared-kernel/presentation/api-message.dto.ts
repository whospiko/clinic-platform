import { ApiProperty } from '@nestjs/swagger';

export class ApiMessageDto {
  @ApiProperty()
  message!: string;
}
