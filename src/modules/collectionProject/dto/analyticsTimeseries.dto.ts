import { ApiPropertyOptional } from '@nestjs/swagger'

export class AnalyticsTimeseriesDto {
  @ApiPropertyOptional({ description: '项目ID' })
  project_id?: string

  @ApiPropertyOptional({ description: '指标', enum: ['pv_count','uv_count','session_count','dom_event_count','custom_event_count','avg_session_duration','bounce_rate','conversion_count','conversion_rate'] })
  metric?: string

  @ApiPropertyOptional({ description: '间隔', enum: ['day','hour'], default: 'day' })
  interval?: 'day' | 'hour'

  @ApiPropertyOptional({ description: '开始时间' })
  date_from?: string | Date

  @ApiPropertyOptional({ description: '结束时间' })
  date_to?: string | Date

  @ApiPropertyOptional({ description: '页面URL(用于PV/自定义事件过滤)' })
  page_url?: string

  @ApiPropertyOptional({ description: '事件类型(用于DOM事件过滤)' })
  event_type?: string

  @ApiPropertyOptional({ description: '转化事件名(用于转化相关指标)', default: 'purchase' })
  conversion_event_name?: string
}
