import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity('t_collection_page_views')
@Index('uk_event_id', ['event_id'], { unique: true })
export class CollectionPageViewEntity {
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

    @Column({ name: 'page_title', nullable: true })
    page_title: string

    @Column({ name: 'page_path', nullable: true })
    page_path: string

    @Column({ name: 'referrer', nullable: true })
    referrer: string

    @Column({ name: 'visit_time', type: 'datetime' })
    visit_time: Date

    @Column({ name: 'stay_duration', type: 'int', unsigned: true, default: 0 })
    stay_duration: number

    @Column({ name: 'screen_width', type: 'int', unsigned: true, nullable: true })
    screen_width: number

    @Column({ name: 'screen_height', type: 'int', unsigned: true, nullable: true })
    screen_height: number

    @Column({ name: 'viewport_width', type: 'int', unsigned: true, nullable: true })
    viewport_width: number

    @Column({ name: 'viewport_height', type: 'int', unsigned: true, nullable: true })
    viewport_height: number

    @Column({ name: 'is_bounce', type: 'tinyint', default: 0 })
    is_bounce: number

    @CreateDateColumn({ name: 'create_time', type: 'datetime', nullable: true })
    create_time: Date
}
