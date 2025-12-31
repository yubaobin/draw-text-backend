import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('t_collection_users')
@Index('uk_project_user', ['project_id', 'user_uuid'], { unique: true })
export class CollectionUserEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'project_id' })
    project_id: string

    @Column({ name: 'user_uuid' })
    user_uuid: string

    @Column({ name: 'device_id', nullable: true })
    device_id: string

    @Column({ name: 'platform', nullable: true })
    platform: string

    @Column({ name: 'browser', nullable: true })
    browser: string

    @Column({ name: 'os', nullable: true })
    os: string

    @CreateDateColumn({
        name: 'create_time',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    create_time: Date

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', nullable: true })
    update_time: Date
}
