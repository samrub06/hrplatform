/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAdminNoteRequestDto } from '../models/CreateAdminNoteRequestDto';
import type { CreateAdminRequestDto } from '../models/CreateAdminRequestDto';
import type { UpdateAdminDto } from '../models/UpdateAdminDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Admin
     * @returns void
     * @throws ApiError
     */
    public createAdmin({
        requestBody,
    }: {
        requestBody: CreateAdminRequestDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/admin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Update Admin
     * @returns void
     * @throws ApiError
     */
    public updateAdmin({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateAdminDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/admin/{id}',
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
     * Delete Admin
     * @returns void
     * @throws ApiError
     */
    public deleteAdmin({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/admin/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Create Admin Note
     * @returns void
     * @throws ApiError
     */
    public createAdminNote({
        requestBody,
    }: {
        requestBody: CreateAdminNoteRequestDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/admin/note',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get Admin Notes
     * @returns void
     * @throws ApiError
     */
    public getAdminNotes({
        userId,
    }: {
        userId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/admin/notes/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Update Admin Note
     * @returns void
     * @throws ApiError
     */
    public updateAdminNote({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/admin/note/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Delete Admin Note
     * @returns void
     * @throws ApiError
     */
    public deleteAdminNote({
        id,
    }: {
        id: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/admin/note/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden.`,
            },
        });
    }
}
