import { ApiProperty } from '@nestjs/swagger'

export class CollectionProjectDto {
    @ApiProperty({ description: '项目唯一标识UUID', required: false })
    project_id: string

    @ApiProperty({ description: '项目名称', required: false })
    project_name: string


    @ApiProperty({ description: '应用密钥Secret', required: false })
    app_secret: string

    @ApiProperty({ description: '状态: 0-禁用, 1-启用', required: false, default: 1 })
    status: number

    @ApiProperty({ description: '创建时间', required: false })
    create_time: Date
}
