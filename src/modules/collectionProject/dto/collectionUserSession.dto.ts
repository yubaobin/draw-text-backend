import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CollectionUserSessionDto {
    @ApiProperty({ description: '会话唯一标识' })
    session_id: string

    @ApiProperty({ description: '用户UUID' })
    user_uuid: string

    @ApiProperty({ description: '设备ID', required: false })
    device_id?: string

    @ApiProperty({ description: '平台: web/ios/android/mini_program/other', required: false })
    platform?: string

    @ApiProperty({ description: '浏览器类型', required: false })
    browser?: string

    @ApiProperty({ description: '操作系统', required: false })
    os?: string

    @ApiPropertyOptional({ description: '会话开始时间，不传则服务端自动生成' })
    start_time?: Date

    @ApiProperty({ description: 'IP地址', required: false })
    ip_address?: string

    @ApiProperty({ description: 'User Agent', required: false })
    user_agent?: string

    @ApiProperty({ description: '来源URL', required: false })
    referrer?: string

    @ApiProperty({ description: '落地页', required: false })
    landing_page?: string

    @ApiProperty({ description: '退出页', required: false })
    exit_page?: string
}
