import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PermissionService } from 'src/permission/permission.service';

export class CheckUserPermissionQuery {
  constructor(
    public readonly userId: string,
    public readonly resource: string,
    public readonly action: 'create' | 'read' | 'edit' | 'delete',
  ) {}
}

@QueryHandler(CheckUserPermissionQuery)
export class CheckUserPermissionHandler
  implements IQueryHandler<CheckUserPermissionQuery>
{
  constructor(private readonly permissionService: PermissionService) {}

  async execute(query: CheckUserPermissionQuery) {
    return this.permissionService.canUserDo(
      query.userId,
      query.action,
      query.resource,
    );
  }
}
