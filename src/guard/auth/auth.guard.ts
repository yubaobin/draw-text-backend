import {
    CanActivate,
    ExecutionContext,
    Injectable,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common'
import { getUrlQuery } from '@/utils'
import { CodeEnum, CodeMessage } from '@/enums/code.enum'
import { API_AUTH_KEY, IS_PUBLIC_KEY } from '@/constants'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor (private reflector: Reflector) { }

    async canActivate (context: ExecutionContext): Promise<boolean> {
        /**
         * 接口白名单
         * import { Public } from '@/decorators/api.auth'
         * @Public
         * function xxx 
         */
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const token = context.switchToRpc().getData().headers.token ||
            context.switchToHttp().getRequest().body.token ||
            getUrlQuery(request.url, 'token')
        Logger.log(`当前的token: ${token}`, 'AuthGuard')
        const methodAuth = Reflect.getMetadata(API_AUTH_KEY, context.getHandler())
        const classAuth = Reflect.getMetadata(API_AUTH_KEY, context.getClass())
        console.log(methodAuth, classAuth, '守卫中', request.method, request.url)
        if (token === 'U2FsdGVkX18Vq2vQYif5sPRZrXdAkt8tZmOoKPLbPJk=') {
            try {
                return true
            } catch (e) {
                Logger.error(e, 'auth')
                throw new HttpException(e, e.status)
            }
        } else {
            throw new HttpException(
                JSON.stringify({ code: CodeEnum.NO_TOKEN, message: CodeMessage[CodeEnum.NO_TOKEN] }),
                HttpStatus.UNAUTHORIZED
            )
        }
    }
}

