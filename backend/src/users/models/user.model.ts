import { IsNotEmpty, MinLength } from 'class-validator';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/enums/role.enum';

@Table({ tableName: 'User' })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id?: number;

  @Column
  first_name?: string;

  @Column
  last_name?: string;

  @Column
  email?: string;

  @Column
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide.' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(Role),
    defaultValue: Role.USER,
  })
  role: Role;

  @Column
  profilePicture?: string;

  @Column
  cv?: string;

  @Column(DataType.JSONB)
  skills: {
    language: string;
    experience_years: number;
    level?: number;
  }[];

  @Column(DataType.JSONB)
  desired_position: {
    name: string;
    description?: string;
  };

  @Column(DataType.TEXT)
  adminNotes?: string;

  @Column
  createdAt?: Date;

  @Column
  updatedAt?: Date;
}
