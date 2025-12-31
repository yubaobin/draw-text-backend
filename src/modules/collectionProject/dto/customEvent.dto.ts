import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CustomEventDto {
    @ApiPropertyOptional({ description: '事件唯一标识（若不传则自动生成）', required: false })
    event_id?: string

    @ApiProperty({ description: '用户UUID' })
    user_uuid: string

    @ApiProperty({ description: '会话ID' })
    session_id: string

    @ApiProperty({ description: '页面URL', required: false })
    page_url?: string

    @ApiProperty({ description: '事件名称' })
    event_name: string

    @ApiProperty({ description: '事件分类', required: false })
    event_category?: string

    @ApiProperty({ description: '事件标签', required: false })
    event_label?: string

    @ApiProperty({ description: '事件值', required: false })
    event_value?: string

    @ApiProperty({ description: '事件时间' })
    event_time: Date

    @ApiProperty({ description: '事件属性(JSON格式)', required: false })
    event_properties?: any
}
