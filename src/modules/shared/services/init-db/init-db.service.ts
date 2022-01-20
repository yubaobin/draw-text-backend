import { Injectable } from '@nestjs/common'

@Injectable()
export class InitDbService {
    constructor () {}

    onModuleInit () {
        console.log('初始化数据库')
    }
}
