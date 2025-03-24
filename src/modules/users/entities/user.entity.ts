import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserEntity {
  id: string;
  email: string;
  password: string;
  name: string | null;
  @ApiProperty({
    enum: Role,
  })
  role: Role;
  emailVerified: boolean;
  provider: string | null;
  providerId: string | null;
  @ApiProperty({
    type: `string`,
    format: `date-time`,
  })
  createdAt: Date;
  @ApiProperty({
    type: `string`,
    format: `date-time`,
  })
  updatedAt: Date;
}
