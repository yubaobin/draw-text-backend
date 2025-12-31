import { QueryOptionsDto } from '@/dto/query.options.dto'
import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { CollectionProjectDto } from './collectionProject.dto'

export class listCollectionProjectDto extends CollectionProjectDto {
    @ApiProperty({ description: '开始时间', required: false })
    startTime: Date

    @ApiProperty({ description: '结束时间', required: false })
    endTime: Date
}

export class pageListCollectionProjectDto extends IntersectionType(listCollectionProjectDto, QueryOptionsDto) {}
