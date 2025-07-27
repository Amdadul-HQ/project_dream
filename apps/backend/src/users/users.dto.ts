import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  email: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  email: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user', required: false })
  name?: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user', required: false })
  email?: string;
}
