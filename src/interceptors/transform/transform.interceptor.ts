import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { instanceToPlain } from 'class-transformer'
import { ResponseVo } from '@/vo/response.vo'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept (_context: ExecutionContext, next: CallHandler): Observable<ResponseVo<any>> {
        return next.handle().pipe(
            map((data: any) => {
                return {
                    result: instanceToPlain(data),
                    code: 0,
                    message: '请求成功'
                }
            })
        )
    }
}
