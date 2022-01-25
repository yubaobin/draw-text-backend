import * as path from 'path'
import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ConfigModule, ConfigService } from 'nestjs-config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoggingInterceptor } from './interceptors/logging/logging.interceptor'
import { ValidationPipe } from './pipe/validation/validation.pipe'
import { TransformInterceptor } from './interceptors/transform/transform.interceptor'
import { TextModule } from './modules/text/text.module'
import { ImageModule } from './modules/image/image.module'

const envPath = path.resolve(process.cwd(),  process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env')
@Module({
    imports: [
        // 配置加载配置文件, 将db.config -> db
        ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}'), {
            modifyConfigName: (name: string) => name.replace('.config', ''),
            path: envPath
        }),
        // mysql的连接
        TypeOrmModule.forRootAsync({
            useFactory: async (config: ConfigService) => {
                return {
                    type: config.get('db.type'),
                    host: config.get('db.host'),
                    port: config.get('db.port'),
                    username: config.get('db.username'),
                    password: config.get('db.password'),
                    database: config.get('db.database'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    logging: config.get('db.logging'),
                    synchronize: config.get('db.synchronize'), // 同步数据库
                    timezone: '+08:00', // 东八区
                    cache: {
                        duration: 60000 // 1分钟的缓存
                    },
                    extra: {
                        poolMax: 32,
                        poolMin: 16,
                        queueTimeout: 60000,
                        pollPingInterval: 60, // 每隔60秒连接
                        pollTimeout: 60 // 连接有效60秒
                    }
                }
            },
            inject: [ConfigService]
        }),
        TextModule,
        ImageModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        },
        // 全局使用管道(数据校验)
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor
        }
    ]
})
export class AppModule {}
