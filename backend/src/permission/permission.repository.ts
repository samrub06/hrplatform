import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '../models/permission.model';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectModel(Permission)
    private permissionModel: typeof Permission,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionModel.create({ ...createPermissionDto });
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.findAll();
  }

  async findOne(id: string): Promise<Permission> {
    return this.permissionModel.findByPk(id);
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);
    if (permission) {
      await permission.update(updatePermissionDto);
    }
    return permission;
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    if (permission) {
      await permission.destroy();
    }
  }

  async findByNameAndDomain(name: string, domain: string): Promise<Permission> {
    return this.permissionModel.findOne({
      where: {
        name,
        domain,
      },
    });
  }
}
