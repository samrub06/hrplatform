import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  can_create: boolean;

  @IsBoolean()
  can_read: boolean;

  @IsBoolean()
  can_edit: boolean;

  @IsBoolean()
  can_delete: boolean;
}
