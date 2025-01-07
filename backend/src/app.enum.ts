export enum Role {
  CANDIDATE = 'candidate',
  PUBLISHER = 'publisher',
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
}

export enum Action {
  Manage = 'manage', // any
  Create = 'create',
  Read = 'read',
  Update = 'edit',
  Delete = 'delete',
}
