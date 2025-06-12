import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PermissionService } from '../../permission/permission.service';

export class GetUserPermissionsQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserPermissionsQuery)
export class GetUserPermissionsHandler
  implements IQueryHandler<GetUserPermissionsQuery>
{
  constructor(private readonly permissionService: PermissionService) {}

  async execute(query: GetUserPermissionsQuery) {
    return this.permissionService.getUserPermissions(query.userId);
  }
}
