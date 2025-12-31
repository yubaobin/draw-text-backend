import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class DomEventDto {
    @ApiPropertyOptional({ description: '事件唯一标识（若不传则自动生成）', required: false })
    event_id?: string

    @ApiProperty({ description: '用户UUID' })
    user_uuid: string

    @ApiProperty({ description: '会话ID' })
    session_id: string

    @ApiProperty({ description: '页面URL' })
    page_url: string

    @ApiProperty({ description: '事件类型: click/dblclick/hover等' })
    event_type: string

    @ApiProperty({ description: '事件时间' })
    event_time: Date

    @ApiProperty({ description: '元素选择器(CSS Selector)', required: false })
    element_selector?: string

    @ApiProperty({ description: '元素名称', required: false })
    element_name?: string

    @ApiProperty({ description: '元素类型: button/link/image等', required: false })
    element_type?: string

    @ApiProperty({ description: '元素文本内容', required: false })
    element_content?: string

    @ApiProperty({ description: '元素目标URL', required: false })
    element_target_url?: string

    @ApiProperty({ description: '额外数据(JSON格式)', required: false })
    extra_data?: any
}
