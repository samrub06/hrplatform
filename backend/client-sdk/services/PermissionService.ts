/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePermissionDto } from '../models/CreatePermissionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PermissionService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Permission
     * @returns void
     * @throws ApiError
     */
    public create({
        requestBody,
    }: {
        requestBody: CreatePermissionDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/permissions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get All Permissions
     * @returns void
     * @throws ApiError
     */
    public findAll(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/permissions',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get Permission By Id
     * @returns void
     * @throws ApiError
     */
    public findOne({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/permissions/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
}
