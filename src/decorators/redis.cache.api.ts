import { applyDecorators, SetMetadata } from '@nestjs/common'
import { REDIS_CACHE_KEY, REDIS_CACHE_EX_SECOND_KEY } from '@/constants'
import redisCacheConfig from '@/config/redis-cache.config'

// 是否缓存
const isCache = true

/**
 * @Description: 自定义装饰器,用于路由上装饰需要缓存的接口
 * @param {number} exSecond redis缓存过期时间,时间为妙
 * @return {*}
 */
export function RedisCacheApi (exSecond: number = redisCacheConfig.redisEXSecond): any {
    return applyDecorators(
        SetMetadata(REDIS_CACHE_KEY, isCache),
        SetMetadata(REDIS_CACHE_EX_SECOND_KEY, exSecond),
    )
}
