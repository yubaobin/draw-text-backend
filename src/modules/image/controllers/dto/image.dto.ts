import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { MaxLength, IsString, IsOptional, IsEnum } from 'class-validator'

/**
 * 普通条件
 */
export class ImageDto {
    @ApiPropertyOptional({ description: '图片地址' })
    @MaxLength(255, { message: '长度最大为255' })
    @IsOptional()
    @IsString({ message: '图片地址必须为字符串' })
    readonly fileurl?: string

    @ApiPropertyOptional({ description: '封面' })
    @IsOptional()
    @IsString({ message: '封面必须为字符串' })
    readonly cover?: string

    @ApiPropertyOptional({
        description: '图片类型, 节日: 1, 浪漫:2, 心情: 3',
        enum: [1, 2, 3]
    })
    @IsEnum({ 节日: 1, 浪漫: 2, 心情: 3 }, { message: '图片类型必须是1、2、3其中一个' })
    @Type(() => Number)
    @IsOptional()
    readonly type?: string

    @ApiPropertyOptional({ description: '排序' })
    @IsOptional()
    readonly sort?: number
}
