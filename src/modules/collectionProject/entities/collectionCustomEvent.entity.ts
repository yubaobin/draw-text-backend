import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity('t_collection_custom_events')
@Index('uk_event_id', ['event_id'], { unique: true })
export class CollectionCustomEventEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'event_id' })
    event_id: string

    @Column({ name: 'project_id' })
    project_id: string

    @Column({ name: 'user_uuid' })
    user_uuid: string

    @Column({ name: 'session_id' })
    session_id: string

    @Column({ name: 'page_url', nullable: true })
    page_url: string

    @Column({ name: 'event_name' })
    event_name: string

    @Column({ name: 'event_category', nullable: true })
    event_category: string

    @Column({ name: 'event_label', nullable: true })
    event_label: string

    @Column({ name: 'event_value', nullable: true })
    event_value: string

    @Column({ name: 'event_time', type: 'datetime' })
    event_time: Date

    @Column({ name: 'event_properties', type: 'json', nullable: true })
    event_properties: any

    @CreateDateColumn({ name: 'create_time', type: 'datetime', nullable: true })
    create_time: Date
}
