import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AdminNote } from '../models/admin-note.model';
import { Admin } from '../models/admin.model';
import { CreateAdminRequestDto } from './commands/create-admin-command.request.dto';
import { CreateAdminNoteRequestDto } from './commands/create-admin-note-command.request.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Admin)
    private adminModel: typeof Admin,
    @InjectModel(AdminNote)
    private adminNoteModel: typeof AdminNote,
  ) {}

  async createAdmin(createAdminDto: CreateAdminRequestDto): Promise<Admin> {
    return this.adminModel.create({
      ...createAdminDto,
    });
  }

  async createNote(
    createNoteDto: CreateAdminNoteRequestDto,
  ): Promise<AdminNote> {
    return this.adminNoteModel.create({
      ...createNoteDto,
    });
  }

  async findAllNotes(userId: string): Promise<AdminNote[]> {
    return this.adminNoteModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async updateNote(id: string, content: string): Promise<AdminNote | null> {
    const note = await this.adminNoteModel.findByPk(id);
    if (!note) return null;
    return note.update({ content });
  }

  async deleteNote(id: string): Promise<boolean> {
    const result = await this.adminNoteModel.destroy({ where: { id } });
    return result > 0;
  }

  async findAdminById(id: string): Promise<Admin | null> {
    return this.adminModel.findByPk(id);
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ where: { email } });
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await this.adminModel.destroy({ where: { id } });
    return result > 0;
  }

  async updateAdmin(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin | null> {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) return null;
    return admin.update(updateAdminDto);
  }
}
