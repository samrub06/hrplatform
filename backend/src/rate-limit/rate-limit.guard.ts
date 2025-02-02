import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Redis from 'ioredis';
import { RATE_LIMIT_KEY, RateLimitOptions } from './rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly redis: Redis;

  constructor(private reflector: Reflector) {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitOptions = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!rateLimitOptions) {
      return true; // No rate limit configured
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(request, rateLimitOptions.keyPrefix);

    const [current, ttl] = await this.isRateLimited(key, rateLimitOptions);

    if (current > rateLimitOptions.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded',
          retryAfter: ttl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private generateKey(request: any, keyPrefix?: string): string {
    // You can customize this to use user ID, IP, or both
    const ip = request.ip;
    const userId = request.user?.id || 'anonymous';
    const baseKey = `${ip}:${userId}`;
    return keyPrefix ? `${keyPrefix}:${baseKey}` : baseKey;
  }

  private async isRateLimited(
    key: string,
    options: RateLimitOptions,
  ): Promise<[number, number]> {
    const multi = this.redis.multi();

    const now = Date.now();
    const clearBefore = now - options.ttl * 1000;

    // Remove old requests
    multi.zremrangebyscore(key, 0, clearBefore);
    // Add current request
    multi.zadd(key, now, `${now}`);
    // Count requests in window
    multi.zcard(key);
    // Set key expiration
    multi.expire(key, options.ttl);

    const results = await multi.exec();
    const requestCount = results[2][1] as number;

    return [requestCount, options.ttl];
  }
}
