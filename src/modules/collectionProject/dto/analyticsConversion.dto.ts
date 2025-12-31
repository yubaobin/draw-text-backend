import { ApiPropertyOptional } from '@nestjs/swagger'

export class AnalyticsConversionDto {
  @ApiPropertyOptional({ description: '项目ID' })
  project_id?: string

  @ApiPropertyOptional({ description: '页面URL' })
  page_url?: string

  @ApiPropertyOptional({ description: '开始日期' })
  stat_date_from?: string | Date

  @ApiPropertyOptional({ description: '结束日期' })
  stat_date_to?: string | Date

  @ApiPropertyOptional({ description: '间隔', enum: ['day','hour'], default: 'day' })
  interval?: 'day' | 'hour'

  @ApiPropertyOptional({ description: '转化事件名', default: 'purchase' })
  conversion_event_name?: string
}
