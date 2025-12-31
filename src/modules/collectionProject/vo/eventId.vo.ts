import { ApiProperty } from '@nestjs/swagger'

export class EventIdVo {
    @ApiProperty({ description: '事件唯一标识' })
    event_id: string
}
