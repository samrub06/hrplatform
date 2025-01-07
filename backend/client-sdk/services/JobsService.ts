/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateJobDto } from '../models/CreateJobDto';
import type { UpdateJobDto } from '../models/UpdateJobDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class JobsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Job
     * @returns void
     * @throws ApiError
     */
    public createJob({
        requestBody,
    }: {
        requestBody: CreateJobDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/jobs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Get All Jobs
     * @returns void
     * @throws ApiError
     */
    public findAllJobs(): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/jobs',
            errors: {
                403: `Forbidden.`,
            },
        });
    }
    /**
     * Update Job By Id
     * @returns void
     * @throws ApiError
     */
    public updateJob({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: UpdateJobDto,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/jobs/{id}',
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
}
