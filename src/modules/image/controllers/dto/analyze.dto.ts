import { ApiPropertyOptional } from '@nestjs/swagger'

export class AnalyzeDto {

    @ApiPropertyOptional({ description: '解析类型' })
    readonly type?: string
}
