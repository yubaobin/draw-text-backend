import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'

export class FileDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File
}

export class FileUploadDto extends FileDto {
    @ApiPropertyOptional({
        description: '图片类型, 节日: 1, 浪漫:2, 心情: 3',
        enum: [1, 2, 3]
    })
    @IsEnum({ 节日: 1, 浪漫: 2, 心情: 3 }, { message: '图片类型必须是1、2、3其中一个' })
    @Type(() => Number)
    @IsOptional()
    readonly type?: string
}
