import { Column, DataType, HasMany, Table } from "sequelize-typescript";

import { Model } from "sequelize-typescript";
import { ReferralPost } from "./referral-post-model";

@Table({ tableName: 'company' })
export class Company extends Model {
  @HasMany(() => ReferralPost, {
    foreignKey: 'company_id',
    as: 'referralPosts',
  })
  referralPosts: ReferralPost[];

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logo_url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  industry: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  size: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_verified: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updated_at: Date;
}