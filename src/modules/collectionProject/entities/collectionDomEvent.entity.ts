import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity('t_collection_dom_events')
@Index('uk_event_id', ['event_id'], { unique: true })
export class CollectionDomEventEntity {
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

    @Column({ name: 'page_url' })
    page_url: string

    @Column({ name: 'event_type' })
    event_type: string

    @Column({ name: 'event_time', type: 'datetime' })
    event_time: Date

    @Column({ name: 'element_selector', nullable: true })
    element_selector: string

    @Column({ name: 'element_name', nullable: true })
    element_name: string

    @Column({ name: 'element_type', nullable: true })
    element_type: string

    @Column({ name: 'element_content', nullable: true })
    element_content: string

    @Column({ name: 'element_target_url', nullable: true })
    element_target_url: string

    @Column({ name: 'extra_data', type: 'json', nullable: true })
    extra_data: any

    @CreateDateColumn({ name: 'create_time', type: 'datetime', nullable: true })
    create_time: Date
}
