import { Transform, TransformFnParams } from 'class-transformer'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'
import { randomUUID } from 'crypto'

@Entity('t_collection_project')
export class CollectionProjectEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'project_id' })
    project_id: string

    @Column({ name: 'project_name' })
    project_name: string

    @Column({ name: 'app_secret' })
    app_secret: string

    @Column({ name: 'status', type: 'tinyint', default: 1 })
    status: number

    @Transform((row: TransformFnParams) => row.value ? +new Date(row.value) : row.value)
    @CreateDateColumn({
        nullable: true,
        name: 'create_time',
        type: 'datetime',
        comment: '创建时间'
    })
    create_time: Date

    @BeforeInsert()
    setDefaults () {
        if (!this.project_id || this.project_id === '') {
            this.project_id = randomUUID()
        }
    }
}
