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
import { API_AUTH_KEY } from '@/constants'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor () { }

    async canActivate (context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = context.switchToRpc().getData().headers.token ||
            context.switchToHttp().getRequest().body.token ||
            getUrlQuery(request.url, 'token')
        Logger.log(`当前的token: ${token}`, 'AuthGuard')
        const methodAuth = Reflect.getMetadata(API_AUTH_KEY, context.getHandler())
        const classAuth = Reflect.getMetadata(API_AUTH_KEY, context.getClass())
        console.log(methodAuth, classAuth, '守卫中', request.method, request.url)
        if (token) {
            try {
                return true
            } catch (e) {
                Logger.error(e, 'auth')
                throw new HttpException(e, e.status)
            }
        } else {
            throw new HttpException(
                JSON.stringify({ code: CodeEnum.NO_TOKEN, message: CodeMessage[CodeEnum.NO_TOKEN] }),
                HttpStatus.OK,
            )
        }
    }
}

