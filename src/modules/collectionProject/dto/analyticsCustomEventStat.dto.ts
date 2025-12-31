import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class AnalyticsCustomEventStatDto {
  @ApiProperty({ description: '项目ID' })
  @IsString()
  project_id: string

  @ApiPropertyOptional({ description: '统计字段，支持多个逗号分隔: event_name,event_category,event_value,event_label,page_url；默认 event_name' })
  @IsOptional()
  @IsString()
  field?: string

  @ApiPropertyOptional({ description: '按 event_category 过滤' })
  @IsOptional()
  @IsString()
  event_category?: string

  @ApiPropertyOptional({ description: '按 event_name 过滤' })
  @IsOptional()
  @IsString()
  event_name?: string

  @ApiPropertyOptional({ description: '开始时间，默认不限' })
  @IsOptional()
  start_time?: Date

  @ApiPropertyOptional({ description: '结束时间，默认当前时间' })
  @IsOptional()
  end_time?: Date

  @ApiPropertyOptional({ description: '返回条数，默认 10' })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number
}
