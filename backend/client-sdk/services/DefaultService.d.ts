import type { CreateJobDto } from '../models/CreateJobDto';
import type { CreateUserRequestDto } from '../models/CreateUserRequestDto';
import type { GeneratePresignedUrlRequestDto } from '../models/GeneratePresignedUrlRequestDto';
import type { LoginDto } from '../models/LoginDto';
import type { RegisterDto } from '../models/RegisterDto';
import type { UpdateJobDto } from '../models/UpdateJobDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
export declare class DefaultService {
    /**
     * @returns any
     * @throws ApiError
     */
    static appControllerGetHello(): CancelablePromise<any>;
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static authControllerRegister(requestBody: RegisterDto): CancelablePromise<any>;
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static authControllerLogin(requestBody: LoginDto): CancelablePromise<any>;
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static usersControllerCreateUser(requestBody: CreateUserRequestDto): CancelablePromise<any>;
    /**
     * @returns any
     * @throws ApiError
     */
    static usersControllerFindAllUsers(): CancelablePromise<any>;
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    static usersControllerFindOneUser(id: string): CancelablePromise<any>;
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static usersControllerUpdateUser(id: string, requestBody: UpdateUserDto): CancelablePromise<any>;
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    static usersControllerRemoveUser(id: string): CancelablePromise<any>;
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static usersControllerGetPresignedUrl(requestBody: GeneratePresignedUrlRequestDto): CancelablePromise<any>;
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    static usersControllerDownloadFile(id: string): CancelablePromise<any>;
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    static usersControllerGetUserPermissions(id: string): CancelablePromise<any>;
    /**
     * @param id
     * @param domain
     * @param action
     * @returns any
     * @throws ApiError
     */
    static usersControllerCheckUserPermission(id: string, domain: string, action: string): CancelablePromise<any>;
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static jobsControllerCreateJob(requestBody: CreateJobDto): CancelablePromise<any>;
    /**
     * @returns any
     * @throws ApiError
     */
    static jobsControllerFindAllJobs(): CancelablePromise<any>;
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    static jobsControllerUpdateJob(id: string, requestBody: UpdateJobDto): CancelablePromise<any>;
}
