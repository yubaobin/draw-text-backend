import { ApiPropertyOptional } from '@nestjs/swagger'

export class AnalyticsPageDistributionDto {
  @ApiPropertyOptional({ description: '项目ID' })
  project_id?: string

  @ApiPropertyOptional({ description: '事件类型', default: 'pv' })
  event_type?: string

  @ApiPropertyOptional({ description: '开始日期' })
  stat_date_from?: string | Date

  @ApiPropertyOptional({ description: '结束日期' })
  stat_date_to?: string | Date

  @ApiPropertyOptional({ description: '限制返回数量', default: 10 })
  limit?: number

  @ApiPropertyOptional({ description: '度量指标', default: 'pv_count' })
  metric?: string
}
