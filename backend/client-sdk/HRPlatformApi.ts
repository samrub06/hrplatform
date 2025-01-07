/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AdminService } from './services/AdminService';
import { AuthService } from './services/AuthService';
import { JobsService } from './services/JobsService';
import { PermissionService } from './services/PermissionService';
import { UserService } from './services/UserService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class HRPlatformApi {
    public readonly admin: AdminService;
    public readonly auth: AuthService;
    public readonly jobs: JobsService;
    public readonly permission: PermissionService;
    public readonly user: UserService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.admin = new AdminService(this.request);
        this.auth = new AuthService(this.request);
        this.jobs = new JobsService(this.request);
        this.permission = new PermissionService(this.request);
        this.user = new UserService(this.request);
    }
}

