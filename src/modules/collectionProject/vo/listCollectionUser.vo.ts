import { ApiProperty, PartialType } from '@nestjs/swagger'
import { QueryListVo } from '@/vo/query.list.vo'
import { CollectionUserVo } from './collectionUser.vo'

export class ListCollectionUserVo extends PartialType(QueryListVo) {
    @ApiProperty({ description: '数据', type: CollectionUserVo, isArray: true })
    data: CollectionUserVo[]
}
