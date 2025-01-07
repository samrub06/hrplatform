/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequestDto } from '../models/LoginRequestDto';
import type { LoginResponseDto } from '../models/LoginResponseDto';
import type { RegisterRequestDto } from '../models/RegisterRequestDto';
import type { RegisterResponseDto } from '../models/RegisterResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Register User
     * @returns RegisterResponseDto Register Sucess
     * @throws ApiError
     */
    public register({
        requestBody,
    }: {
        requestBody: RegisterRequestDto,
    }): CancelablePromise<RegisterResponseDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Données invalides`,
                409: `Email Already Used`,
            },
        });
    }
    /**
     * Login User
     * @returns LoginResponseDto Login Success
     * @throws ApiError
     */
    public login({
        requestBody,
    }: {
        requestBody: LoginRequestDto,
    }): CancelablePromise<LoginResponseDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Information Invalid`,
            },
        });
    }
}
