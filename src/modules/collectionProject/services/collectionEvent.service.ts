import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { randomUUID } from 'crypto'
import { CollectionPageViewEntity } from '../entities/collectionPageView.entity'
import { CollectionDomEventEntity } from '../entities/collectionDomEvent.entity'
import { CollectionCustomEventEntity } from '../entities/collectionCustomEvent.entity'
import { PageViewEventDto } from '../dto/pageViewEvent.dto'
import { PageLeaveEventDto } from '../dto/pageLeaveEvent.dto'
import { DomEventDto } from '../dto/domEvent.dto'
import { CustomEventDto } from '../dto/customEvent.dto'

@Injectable()
export class CollectionEventService {
    constructor (
        @(InjectRepository(CollectionPageViewEntity) as any)
        private readonly pageViewRepo: Repository<CollectionPageViewEntity>,
        @(InjectRepository(CollectionDomEventEntity) as any)
        private readonly domEventRepo: Repository<CollectionDomEventEntity>,
        @(InjectRepository(CollectionCustomEventEntity) as any)
        private readonly customEventRepo: Repository<CollectionCustomEventEntity>,
    ) {}

    private async ensureUnique (event_id: string, repo: Repository<any>) {
        const existed = await repo.findOne({ where: { event_id } })
        if (existed) return true
        return false
    }

    private assertRequired (payload: Record<string, any>, keys: string[]) {
        for (const key of keys) {
            if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
                throw new HttpException(`参数缺失: ${key} 必填`, HttpStatus.OK)
            }
        }
    }

    async createPageView (project_id: string, payload: PageViewEventDto) {
        this.assertRequired(payload as any, ['user_uuid', 'session_id', 'page_url', 'page_title', 'page_path'])
        const event_id = payload.event_id || randomUUID()
        const existed = await this.ensureUnique(event_id, this.pageViewRepo)
        if (existed) return { event_id }
        const visit_time = payload.visit_time ? new Date(payload.visit_time) : new Date()
        
        // 检查是否存在相同的页面访问记录（字段组合相同且 stay_duration=0）
        const existingPageView = await this.pageViewRepo.findOne({
            where: {
                project_id,
                user_uuid: payload.user_uuid,
                session_id: payload.session_id,
                page_url: payload.page_url,
                page_title: payload.page_title,
                page_path: payload.page_path,
                stay_duration: 0
            },
            order: { visit_time: 'DESC' }
        })
        
        if (existingPageView) {
            return { event_id: existingPageView.event_id }
        }
        
        const data = this.pageViewRepo.create({
            ...payload,
            event_id,
            project_id,
            visit_time,
            // stay_duration 由离开接口计算
            stay_duration: 0,
            is_bounce: payload.is_bounce ?? 0
        })
        await this.pageViewRepo.save(data)
        return { event_id }
    }

    async createDomEvent (project_id: string, payload: DomEventDto) {
        this.assertRequired(payload as any, ['user_uuid', 'session_id', 'page_url', 'event_type'])
        const event_id = payload.event_id || randomUUID()
        const existed = await this.ensureUnique(event_id, this.domEventRepo)
        if (existed) return { event_id }
        const event_time = payload.event_time ? new Date(payload.event_time) : new Date()
        const data = this.domEventRepo.create({ ...payload, event_id, project_id, event_time })
        await this.domEventRepo.save(data)
        return { event_id }
    }

    async createCustomEvent (project_id: string, payload: CustomEventDto) {
        this.assertRequired(payload as any, ['user_uuid', 'session_id', 'event_name'])
        const event_id = payload.event_id || randomUUID()
        const existed = await this.ensureUnique(event_id, this.customEventRepo)
        if (existed) return { event_id }
        const event_time = payload.event_time ? new Date(payload.event_time) : new Date()
        const data = this.customEventRepo.create({ ...payload, event_id, project_id, event_time })
        await this.customEventRepo.save(data)
        return { event_id }
    }

    async updatePageStayDuration (project_id: string, payload: PageLeaveEventDto) {
        // 构建查询条件：优先使用 event_id，否则必须提供全部5个字段
        const where: any = { project_id }
        if (payload.event_id) {
            where.event_id = payload.event_id
        } else {
            // 必须同时提供 user_uuid, session_id, page_url, page_title, page_path
            const requiredFields = ['user_uuid', 'session_id', 'page_url', 'page_title', 'page_path']
            const missingFields = requiredFields.filter(field => !payload[field as keyof PageLeaveEventDto])
            if (missingFields.length > 0) {
                throw new HttpException(`必须提供 event_id 或完整的字段组合（user_uuid, session_id, page_url, page_title, page_path）。缺失字段：${missingFields.join(', ')}`, HttpStatus.OK)
            }
            where.user_uuid = payload.user_uuid
            where.session_id = payload.session_id
            where.page_url = payload.page_url
            where.page_title = payload.page_title
            where.page_path = payload.page_path
        }

        const pageView = await this.pageViewRepo.findOne({ where, order: { visit_time: 'DESC' } })
        if (!pageView) {
            throw new HttpException('页面访问事件不存在', HttpStatus.OK)
        }
        const leaveTime = payload.leave_time ? new Date(payload.leave_time) : new Date()
        const visit = new Date(pageView.visit_time)
        const staySeconds = Math.max(0, Math.round((leaveTime.getTime() - visit.getTime()) / 1000))
        pageView.stay_duration = staySeconds
        if (payload.is_bounce !== undefined && payload.is_bounce !== null) {
            pageView.is_bounce = payload.is_bounce
        }
        await this.pageViewRepo.save(pageView)
        return { event_id: pageView.event_id, stay_duration: staySeconds }
    }
}
