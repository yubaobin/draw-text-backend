import { Column, Entity } from 'typeorm'
import { SharedEntity } from '@/modules/shared/entities/shared.entity'

@Entity('image')
export class ImageEntity extends SharedEntity {
    @Column({
        type: 'varchar',
        length: 255,
        name: 'fileurl',
        comment: '图片地址'
    })
    fileurl: string

    @Column({
        type: 'varchar',
        length: 255,
        name: 'cover',
        comment: '封面'
    })
    cover: string

    @Column({
        type: 'varchar',
        length: 10,
        name: 'type',
        comment: '图片类型',
        default: '1'
    })
    type: string

    @Column({
        type: 'int',
        nullable: false,
        default: 1,
        name: 'sort',
        comment: '排序'
    })
    sort: number
}
