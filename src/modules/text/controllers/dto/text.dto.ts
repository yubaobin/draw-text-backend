import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

/**
 * 普通条件
 */
export class TextDto {
    @ApiPropertyOptional({ description: '坐标点' })
    @IsOptional()
    readonly points?: string

    @ApiPropertyOptional({ description: '文字' })
    @IsOptional()
    readonly text?: string
}
