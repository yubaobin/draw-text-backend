import { QueryVo } from '@/vo/query.vo'
import { QueryListVo } from '@/vo/query.list.vo'
import { ApiProperty } from '@nestjs/swagger'

export class TextVo extends QueryVo {
  @ApiProperty({ description: 'id' })
  id: number
  
  @ApiProperty({ description: '坐标点' })
  points: string

  @ApiProperty({ description: '文字' })
  text: string
}

export class TextListVo extends QueryListVo {
  @ApiProperty({ description: '返回数据列表', type: TextVo, isArray: true })
  data: TextVo[]
}
