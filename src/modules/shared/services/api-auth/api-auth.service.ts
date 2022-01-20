import { Injectable } from '@nestjs/common'
import { ICurrentUserType } from '@/decorators/current.user'

@Injectable()
export class ApiAuthService {
    constructor () { }
    /**
     * 拦截api
     * @param {ICurrentUserType} _user
     * @param {string} method
     * @param {string} url
     * @return {*}
     */
    /* eslint-disable @typescript-eslint/no-unused-vars */
    public async apiAuth (_user: ICurrentUserType, _method: string, _url: string): Promise<boolean> {
        return true
    }
}
