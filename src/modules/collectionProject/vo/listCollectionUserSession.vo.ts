import { ApiProperty, PartialType } from '@nestjs/swagger'
import { QueryListVo } from '@/vo/query.list.vo'
import { CollectionUserSessionVo } from './collectionUserSession.vo'

export class ListCollectionUserSessionVo extends PartialType(QueryListVo) {
    @ApiProperty({ description: '数据', type: CollectionUserSessionVo, isArray: true })
    data: CollectionUserSessionVo[]
}
