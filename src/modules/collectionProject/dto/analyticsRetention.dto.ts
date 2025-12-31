import { ApiPropertyOptional } from '@nestjs/swagger'

export class AnalyticsRetentionDto {
  @ApiPropertyOptional({ description: '项目ID' })
  project_id?: string

  @ApiPropertyOptional({ description: '首次访问开始日期' })
  first_visit_date_from?: string | Date

  @ApiPropertyOptional({ description: '首次访问结束日期' })
  first_visit_date_to?: string | Date

  @ApiPropertyOptional({ description: '留存天数(如1/7/30)，不传则返回cohort明细' })
  retention_day?: number
}
