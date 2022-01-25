import { ApiProperty } from '@nestjs/swagger'

export class QueryListVo {
    @ApiProperty({ description: '总页数' })
    total: number

    @ApiProperty({ description: '页码' })
    size: number

    @ApiProperty({ description: '当前页' })
    current: number
}
