import { QueryVo } from '@/vo/query.vo'
import { QueryListVo } from '@/vo/query.list.vo'
import { ApiProperty } from '@nestjs/swagger'

export class ImageVo extends QueryVo {
  @ApiProperty({ description: 'id' })
  id: number
  
  @ApiProperty({ description: '图片地址' })
  fileurl: string

  @ApiProperty({ description: '封面' })
  cover: string

  @ApiProperty({ description: '图片类型' })
  type: string

  @ApiProperty({ description: '排序' })
  sort: number
}

export class ImageListVo extends QueryListVo {
  @ApiProperty({ description: '返回数据列表', type: ImageVo, isArray: true })
  data: ImageVo[]
}
