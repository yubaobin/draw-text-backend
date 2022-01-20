import { applyDecorators, SetMetadata } from '@nestjs/common'
import { API_AUTH_KEY } from '@/constants'

/**
 * @Description: 自定义API守卫装饰器
 * @param {*}
 * @return {*}
 */
export function ApiAuth () {
    return applyDecorators(SetMetadata(API_AUTH_KEY, true))
}
