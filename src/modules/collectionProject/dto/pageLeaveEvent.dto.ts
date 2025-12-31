import { ApiPropertyOptional } from '@nestjs/swagger'

export class PageLeaveEventDto {
  @ApiPropertyOptional({ description: '页面访问事件的 event_id（优先使用）' })
  event_id?: string

  @ApiPropertyOptional({ description: '用户UUID（与其他字段组合使用）' })
  user_uuid?: string

  @ApiPropertyOptional({ description: '会话ID（与其他字段组合使用）' })
  session_id?: string

  @ApiPropertyOptional({ description: '页面URL（与其他字段组合使用）' })
  page_url?: string

  @ApiPropertyOptional({ description: '页面标题（与其他字段组合使用）' })
  page_title?: string

  @ApiPropertyOptional({ description: '页面路径（与其他字段组合使用）' })
  page_path?: string

  @ApiPropertyOptional({ description: '离开时间(ISO)，不传则按服务端时间计算' })
  leave_time?: Date

  @ApiPropertyOptional({ description: '是否跳出: 0-否, 1-是', default: 0 })
  is_bounce?: number
}
