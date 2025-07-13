import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Role } from '../../models/role.model';
import { UserRepository } from '../user.repository';
import { UpdateUserRequestDto } from './update-user.command.request.dto';
import { UpdateUserValidator } from './update-user.command.validator';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly request: UpdateUserRequestDto,
  ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly validator: UpdateUserValidator,
  ) {}

  async execute(command: UpdateUserCommand) {
    const { id, request } = command;

    if (!this.validator.validate(request)) {
      throw new BadRequestException('Invalid user data');
    }

    // Check if email is being updated and if it already exists for another user
    if (request.email) {
      const existingUser = await this.userRepository.findByEmail(request.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`Email '${request.email}' is already taken by another user`);
      }
    }

    // Handle role update if provided
    if (request.role) {
      const role = await Role.findOne({ where: { name: request.role } });
      if (!role) {
        throw new BadRequestException(`Role '${request.role}' not found`);
      }
      
      // Replace role name with role_id in the request
      const { role: roleName, ...userData } = request;
      const updatedUser = await this.userRepository.update(id, {
        ...userData,
        role_id: role.id
      });
      
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      return updatedUser;
    }

    // Update user without role change
    const { role, ...userData } = request;
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }
}
