import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { TextDto } from './text.dto'

export class UpdateTextDto extends TextDto {
    @ApiPropertyOptional({ required: false, description: 'id' })
    @Type(() => String)
    readonly id?: number
}
