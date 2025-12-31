import { ApiPropertyOptional } from '@nestjs/swagger'

export class AnalyticsCompareDto {
  @ApiPropertyOptional({ description: '项目ID' })
  project_id?: string

  @ApiPropertyOptional({ description: '指标列表逗号分隔' })
  metrics?: string

  @ApiPropertyOptional({ description: '事件类型(用于DOM)' })
  event_type?: string

  @ApiPropertyOptional({ description: '页面URL(用于PV/自定义)' })
  page_url?: string

  @ApiPropertyOptional({ description: '开始日期' })
  stat_date_from?: string | Date

  @ApiPropertyOptional({ description: '结束日期' })
  stat_date_to?: string | Date
}
