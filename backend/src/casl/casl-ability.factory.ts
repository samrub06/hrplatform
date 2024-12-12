import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/app.enum';
import { Permission } from 'src/models/permission.model';
import { Admin } from '../admin/models/admin.model';
import { Job } from '../jobs/models/job.model';
import { PermissionService } from '../permission/permission.service';
import { User } from '../users/models/user.model';

type Subjects =
  | InferSubjects<typeof User | typeof Admin | typeof Job | typeof Permission>
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private permissionService: PermissionService) {}

  subjectMap = {
    User: User,
    Admin: Admin,
    Job: Job,
    Permision: Permission,
    // Ajoutez d'autres mappings selon vos domaines
  };

  async createForUser(user: User | Admin) {
    const { can, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    const permissions = await this.permissionService.getUserPermissions(
      user.id,
    );

    permissions.forEach((permissionInstance) => {
      const permission = permissionInstance.dataValues || permissionInstance;

      const subject = this.subjectMap[permission.domain] || permission.domain;
      if (permission.can_create) {
        can(Action.Create, subject);
      }
      if (permission.can_read) {
        can(Action.Read, subject);
      }
      if (permission.can_edit) {
        can(Action.Update, subject);
      }
      if (permission.can_delete) {
        can(Action.Delete, subject);
      }
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
