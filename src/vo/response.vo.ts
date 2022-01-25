import { ApiProperty } from '@nestjs/swagger'

export class ResponseVo<T> {
    @ApiProperty({ description: '数据' })
    result: T
    @ApiProperty({ description: '状态码' })
    code: number
    @ApiProperty({ description: '反馈信息' })
    message: string
}
