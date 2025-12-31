import { applyDecorators, SetMetadata } from '@nestjs/common'
import { API_AUTH_KEY, IS_PUBLIC_KEY } from '@/constants'

/**
 * @Description: 自定义API守卫装饰器
 * @param {*}
 * @return {*}
 */
export function ApiAuth () {
    return applyDecorators(SetMetadata(API_AUTH_KEY, true))
}

/**
 * 白名单
 */
export function Public () {
    return applyDecorators(SetMetadata(IS_PUBLIC_KEY, true))
}
