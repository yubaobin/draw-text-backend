import { ApiProperty, PartialType } from '@nestjs/swagger'
import { QueryListVo } from '@/vo/query.list.vo'
import { CollectionProjectVo } from './collectionProject.vo'

export class listCollectionProjectVo extends PartialType(QueryListVo) {
    @ApiProperty({ description: '数据', type: CollectionProjectVo, isArray: true })
    data: CollectionProjectVo[]
}
