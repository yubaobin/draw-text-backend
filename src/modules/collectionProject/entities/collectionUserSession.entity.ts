import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity('t_collection_user_sessions')
@Index('uk_session_id', ['session_id'], { unique: true })
export class CollectionUserSessionEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'session_id' })
    session_id: string

    @Column({ name: 'project_id' })
    project_id: string

    @Column({ name: 'user_uuid' })
    user_uuid: string

    @Column({ name: 'start_time', type: 'datetime' })
    start_time: Date

    @Column({ name: 'ip_address', nullable: true })
    ip_address: string

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    user_agent: string

    @Column({ name: 'referrer', nullable: true })
    referrer: string

    @Column({ name: 'landing_page', nullable: true })
    landing_page: string

    @Column({ name: 'exit_page', nullable: true })
    exit_page: string

    @CreateDateColumn({ name: 'create_time', type: 'datetime', nullable: true })
    create_time: Date

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', nullable: true })
    update_time: Date
}
