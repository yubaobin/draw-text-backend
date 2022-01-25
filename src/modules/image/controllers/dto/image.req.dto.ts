import { QueryOptionsDto } from '@/dto/query.options.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

/**
 * 查询条件
 */
export class ImageReqDto {
    @ApiPropertyOptional({ description: '图片类型' })
    @IsOptional()
    type?: string
}
/**
 * 分页查询条件
 */
export class ImageReqListDto extends QueryOptionsDto {
    @ApiPropertyOptional({ description: '图片类型' })
    @IsOptional()
    type?: string
}
