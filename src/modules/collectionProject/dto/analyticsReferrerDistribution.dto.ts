import { ApiPropertyOptional } from '@nestjs/swagger'

export class AnalyticsReferrerDistributionDto {
  @ApiPropertyOptional({ description: '项目ID' })
  project_id?: string

  @ApiPropertyOptional({ description: '开始时间' })
  start_time?: string | Date

  @ApiPropertyOptional({ description: '结束时间' })
  end_time?: string | Date

  @ApiPropertyOptional({ description: '限制返回数量', default: 10 })
  limit?: number
}
