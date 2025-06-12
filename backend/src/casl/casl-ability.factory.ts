import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../app.enum';
import { Admin } from '../models/admin.model';
import { CV } from '../models/cv.model';
import { Job } from '../models/job.model';
import { Permission } from '../models/permission.model';
import { User } from '../models/user.model';
import { PermissionService } from '../permission/permission.service';

type Subjects =
  | InferSubjects<
      typeof User | typeof Admin | typeof Job | typeof Permission | typeof CV
    >
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
    CV: CV,
    // Ajoutez d'autres mappings selon vos domaines
  };

  async createForUser(user: User) {
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
