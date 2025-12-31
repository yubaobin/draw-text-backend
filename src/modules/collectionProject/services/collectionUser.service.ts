import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { CollectionUserEntity } from '../entities/collectionUser.entity'
import { UpsertCollectionUserDto } from '../dto/upsertCollectionUser.dto'
import { UpdateCollectionUserDto } from '../dto/updateCollectionUser.dto'
import { pageListCollectionUserDto } from '../dto/listCollectionUser.dto'

@Injectable()
export class CollectionUserService {
    constructor (
        @(InjectRepository(CollectionUserEntity) as any)
        private readonly collectionUserRepository: Repository<CollectionUserEntity>
    ) {}

    async upsertUser (project_id: string, payload: UpsertCollectionUserDto) {
        const { user_uuid } = payload
        if (!project_id || !user_uuid) {
            throw new HttpException('项目ID与用户UUID不能为空', HttpStatus.OK)
        }
        const existed = await this.collectionUserRepository.findOne({ where: { project_id, user_uuid } })
        if (existed) {
            const updateData: Partial<CollectionUserEntity> = {}
            if (payload.device_id) updateData.device_id = payload.device_id
            if (payload.platform) updateData.platform = payload.platform
            if (payload.browser) updateData.browser = payload.browser
            if (payload.os) updateData.os = payload.os
            if (Object.keys(updateData).length > 0) {
                await this.collectionUserRepository.update(existed.id, updateData)
            }
            return { project_id, user_uuid }
        }
        // create new
        const data = this.collectionUserRepository.create({
            project_id,
            user_uuid,
            device_id: payload.device_id,
            platform: payload.platform,
            browser: payload.browser,
            os: payload.os
        })
        await this.collectionUserRepository.save(data)
        return { project_id, user_uuid }
    }

    async getListByPage (project_id: string, params: pageListCollectionUserDto) {
        const pageSize = Number(params.size ?? 10)
        const pageNumber = Number(params.current ?? 1)

        const where: FindConditions<CollectionUserEntity> = { project_id }
        if (params.platform) where.platform = params.platform

        const [data, total] = await this.collectionUserRepository.findAndCount({
            where,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            order: { update_time: 'DESC' }
        })

        return {
            data,
            total,
            pageSize,
            pageNumber
        }
    }

    async findOne (project_id: string, user_uuid: string) {
        const existed = await this.collectionUserRepository.findOne({ where: { project_id, user_uuid } })
        if (!existed) {
            throw new HttpException('用户不存在', HttpStatus.OK)
        }
        return existed
    }

    async updateUser (project_id: string, user_uuid: string, payload: UpdateCollectionUserDto) {
        const existed = await this.collectionUserRepository.findOne({ where: { project_id, user_uuid } })
        if (!existed) {
            throw new HttpException('用户不存在', HttpStatus.OK)
        }
        await this.collectionUserRepository.update(existed.id, payload)
        return { project_id, user_uuid }
    }
}
