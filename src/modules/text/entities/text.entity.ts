import { Column, Entity } from 'typeorm'
import { SharedEntity } from '@/modules/shared/entities/shared.entity'

@Entity('text')
export class TextEntity extends SharedEntity {
    @Column({
        type: 'mediumtext',
        name: 'points',
        comment: '坐标点'
    })
    points: string

    @Column({
        type: 'varchar',
        length: 255,
        name: 'text',
        comment: '文字'
    })
    text: string
}
