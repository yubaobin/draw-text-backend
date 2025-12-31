import { IntersectionType, ApiPropertyOptional } from '@nestjs/swagger'
import { QueryOptionsDto } from '@/dto/query.options.dto'
import { CollectionUserSessionDto } from './collectionUserSession.dto'

export class listCollectionUserSessionDto extends CollectionUserSessionDto {
    @ApiPropertyOptional({ description: '开始时间', required: false })
    startTime?: Date

    @ApiPropertyOptional({ description: '结束时间', required: false })
    endTime?: Date
}

export class pageListCollectionUserSessionDto extends IntersectionType(listCollectionUserSessionDto, QueryOptionsDto) {}
