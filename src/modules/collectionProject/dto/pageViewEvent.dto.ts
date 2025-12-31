import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PageViewEventDto {
    @ApiPropertyOptional({ description: '事件唯一标识（若不传则自动生成）', required: false })
    event_id?: string

    @ApiProperty({ description: '用户UUID' })
    user_uuid: string

    @ApiProperty({ description: '会话唯一标识' })
    session_id: string

    @ApiProperty({ description: '页面URL' })
    page_url: string

    @ApiProperty({ description: '页面标题', required: false })
    page_title?: string

    @ApiProperty({ description: '页面路径', required: false })
    page_path?: string

    @ApiProperty({ description: '来源页面', required: false })
    referrer?: string

    @ApiPropertyOptional({ description: '访问时间，不传则服务端自动生成' })
    visit_time?: Date

    @ApiProperty({ description: '停留时长(秒)', required: false, default: 0 })
    stay_duration?: number

    @ApiProperty({ description: '屏幕宽度', required: false })
    screen_width?: number

    @ApiProperty({ description: '屏幕高度', required: false })
    screen_height?: number

    @ApiProperty({ description: '视口宽度', required: false })
    viewport_width?: number

    @ApiProperty({ description: '视口高度', required: false })
    viewport_height?: number

    @ApiProperty({ description: '是否跳出: 0-否, 1-是', required: false, default: 0 })
    is_bounce?: number
}
