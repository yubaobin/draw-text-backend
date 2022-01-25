import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ImageDto } from './image.dto'

export class UpdateImageDto extends ImageDto {
    @ApiPropertyOptional({ required: false, description: 'id' })
    @Type(() => String)
    readonly id?: number
}
