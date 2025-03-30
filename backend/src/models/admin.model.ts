import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { AdminNote } from './admin-note.model';

@Table({ tableName: 'admin' })
export class Admin extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => AdminNote, {
    foreignKey: 'admin_id',
    as: 'adminNotes',
    onDelete: 'CASCADE',
  })
  adminNotes: AdminNote;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
