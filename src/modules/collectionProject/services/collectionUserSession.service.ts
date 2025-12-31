import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, FindConditions, Repository } from 'typeorm'
import { CollectionUserSessionEntity } from '../entities/collectionUserSession.entity'
import { CreateCollectionUserSessionDto } from '../dto/createCollectionUserSession.dto'
import { UpdateCollectionUserSessionDto } from '../dto/updateCollectionUserSession.dto'
import { pageListCollectionUserSessionDto } from '../dto/listCollectionUserSession.dto'
import { CollectionUserService } from './collectionUser.service'

@Injectable()
export class CollectionUserSessionService {
    constructor (
        @(InjectRepository(CollectionUserSessionEntity) as any)
        private readonly collectionUserSessionRepository: Repository<CollectionUserSessionEntity>,
        private readonly collectionUserService: CollectionUserService
    ) {}

    async create (project_id: string, payload: CreateCollectionUserSessionDto, requestIp?: string) {
        const { session_id, user_uuid } = payload
        if (!session_id || !project_id || !user_uuid) {
            throw new HttpException('参数缺失: session_id, user_uuid 必填', HttpStatus.OK)
        }
        const existed = await this.collectionUserSessionRepository.findOne({ where: { session_id } })
        if (existed) {
            return { session_id }
        }

        const start_time = payload.start_time ? new Date(payload.start_time) : new Date()

        // 用户不存在则创建/更新基本画像
        await this.collectionUserService.upsertUser(project_id, {
            user_uuid,
            device_id: payload.device_id,
            platform: payload.platform,
            browser: payload.browser,
            os: payload.os
        })
        const ip_address = payload.ip_address || requestIp || ''

        // 防止并发重复创建 session，使用插入忽略保证幂等
        await this.collectionUserSessionRepository.manager.transaction(async manager => {
            await manager
                .createQueryBuilder()
                .insert()
                .into(CollectionUserSessionEntity)
                .values({
                    session_id,
                    project_id,
                    user_uuid,
                    start_time,
                    ip_address,
                    user_agent: payload.user_agent,
                    referrer: payload.referrer,
                    landing_page: payload.landing_page,
                    exit_page: payload.exit_page
                })
                .orIgnore()
                .execute()
        })
        return { session_id }
    }

    async update (session_id: string, payload: UpdateCollectionUserSessionDto) {
        const existed = await this.collectionUserSessionRepository.findOne({ where: { session_id } })
        if (!existed) {
            throw new HttpException('会话不存在', HttpStatus.OK)
        }
        await this.collectionUserSessionRepository.update(existed.id, payload)
        return { session_id }
    }

    async getListByPage (project_id: string, params: pageListCollectionUserSessionDto) {
        const pageSize = Number(params.size ?? 10)
        const pageNumber = Number(params.current ?? 1)

        const where: FindConditions<CollectionUserSessionEntity> = { project_id }
        if (params.user_uuid) where.user_uuid = params.user_uuid
        if (params.startTime && params.endTime) {
            where.start_time = Between(params.startTime, params.endTime)
        }

        const [data, total] = await this.collectionUserSessionRepository.findAndCount({
            where,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            order: { start_time: 'DESC' }
        })

        return {
            data,
            total,
            pageSize,
            pageNumber
        }
    }

    async findOne (session_id: string) {
        const existed = await this.collectionUserSessionRepository.findOne({ where: { session_id } })
        if (!existed) {
            throw new HttpException('会话不存在', HttpStatus.OK)
        }
        return existed
    }
}
