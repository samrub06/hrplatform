/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequestDto } from '../models/CreateUserRequestDto';
import type { GeneratePresignedUrlRequestDto } from '../models/GeneratePresignedUrlRequestDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create User
     * @returns void
     * @throws ApiError
     */
    public createUser({
        requestBody,
    }: {
        requestBody: CreateUserRequestDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/user',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get All Users
     * @returns void
     * @throws ApiError
     */
    public findAllUsers(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get User By Id
     * @returns User The found record
     * @throws ApiError
     */
    public findOneUser({
        id,
    }: {
        id: string,
    }): CancelablePromise<User> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update User By Id
     * @returns void
     * @throws ApiError
     */
    public updateUser({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateUserDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Delete User By Id
     * @returns void
     * @throws ApiError
     */
    public removeUser({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get Presign-Url AWS
     * @returns void
     * @throws ApiError
     */
    public getPresignedUrl({
        requestBody,
    }: {
        requestBody: GeneratePresignedUrlRequestDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/user/presigned-url',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Download CV
     * @returns void
     * @throws ApiError
     */
    public downloadFile({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/download/cv/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get User Permissions
     * @returns void
     * @throws ApiError
     */
    public getUserPermissions({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}/permissions',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get User Permision By Domain
     * @returns void
     * @throws ApiError
     */
    public checkUserPermission({
        id,
        domain,
        action,
    }: {
        id: string,
        domain: string,
        action: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/user/{id}/can-do',
            path: {
                'id': id,
            },
            query: {
                'domain': domain,
                'action': action,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
}
