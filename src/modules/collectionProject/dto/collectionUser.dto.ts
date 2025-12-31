import { ApiProperty } from '@nestjs/swagger'

export class CollectionUserDto {
    @ApiProperty({ description: '用户唯一标识UUID' })
    user_uuid: string

    @ApiProperty({ description: '设备ID', required: false })
    device_id?: string

    @ApiProperty({ description: '平台: web/ios/android/mini_program/other', required: false })
    platform?: string

    @ApiProperty({ description: '浏览器类型', required: false })
    browser?: string

    @ApiProperty({ description: '操作系统', required: false })
    os?: string
}
