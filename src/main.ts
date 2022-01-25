import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from '@nestjs/common'
import helmet from 'helmet'
import { ConfigService } from 'nestjs-config'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters/http-exception.filter'
// import { TransformInterceptor } from './interceptors/transform/transform.interceptor';

export const IS_DEV = process.env.NODE_ENV !== 'production'
async function bootstrap () {
    const logger: Logger = new Logger('main.ts')
    console.log(IS_DEV, '是否为开发环境')
    const app = await NestFactory.create(AppModule, {
        // 开启日志级别打印
        logger: IS_DEV ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn']
    })
    const config: ConfigService = app.get(ConfigService)
    const PORT = config.get('system.port') || 8080
    const PREFIX = config.get('system.prefix') || '/'
    // 允许跨域请求
    app.enableCors()
    // 给请求添加prefix
    app.setGlobalPrefix(PREFIX)
    // 配置api文档信息(不是生产环境配置文档)
    if (IS_DEV) {
        const options = new DocumentBuilder()
            .setTitle('api文档')
            .setDescription('api接口文档')
            .addBearerAuth({ type: 'apiKey', in: 'header', name: 'token' })
            .setVersion('0.0.1')
            .build()

        const document = SwaggerModule.createDocument(app, options)
        SwaggerModule.setup(`${PREFIX}/docs`, app, document)
        SwaggerModule.setup('api', app, document)
    }
    // Web漏洞的
    app.use(helmet())

    // 全局注册错误的过滤器(错误异常)
    app.useGlobalFilters(new HttpExceptionFilter())
    // 全局注册拦截器(成功返回格式)
    // app.useGlobalInterceptors(new TransformInterceptor());
    await app.listen(PORT, () => {
        logger.log(`服务已经启动,接口请访问:http://wwww.localhost:${PORT}/${PREFIX}`)
        logger.log(`服务已经启动,文档请访问:http://wwww.localhost:${PORT}/${PREFIX}/docs`)
    })
}
bootstrap()
