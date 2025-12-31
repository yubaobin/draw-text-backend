import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, getConnection, ILike, Repository } from 'typeorm'
import { omit } from 'lodash'
import { CollectionProjectEntity } from '../entities/collectionProject.entity'
import { aesEncrypt, aesDecrypt } from '@/utils/aes'
import { CreateCollectionProjectDto } from '../dto/createCollectionProject.dto'
import { UpdateCollectionProjectDto } from '../dto/updateCollectionProject.dto'
import { listCollectionProjectDto, pageListCollectionProjectDto } from '../dto/listCollectionProject.dto'
import { CollectionProjectDto } from '../dto/collectionProject.dto'

function addDtoParams (params: listCollectionProjectDto) {
    const queryParams = omit(params, ['startTime', 'endTime'])

    return new Brackets(qb => {
        for (const key of Object.keys(queryParams) as (keyof CollectionProjectDto)[]) {
            if (params[key] != null && params[key] !== '') {
                if (typeof params[key] === 'number') {
                    qb.andWhere({ [key]: params[key] })
                } else {
                    qb.andWhere({ [key]: ILike(`%${params[key]}%`) })
                }
            }
        }
        if (params.startTime && params.endTime) {
            qb.andWhere('cp.create_time BETWEEN :startTime AND :endTime', {
                startTime: params.startTime,
                endTime: params.endTime
            })
        }
    })
}

@Injectable()
export class CollectionProjectService {
    constructor (
        @(InjectRepository(CollectionProjectEntity) as any)
        private readonly collectionProjectRepository: Repository<CollectionProjectEntity>
    ) {}

    private async assertUnique (project_name?: string, excludeId?: number) {
        if (project_name) {
            const existedProjectName = await this.collectionProjectRepository.findOne({ where: { project_name } })
            if (existedProjectName && +existedProjectName.id !== excludeId) {
                throw new HttpException('项目名称已存在', HttpStatus.OK)
            }
        }
    }

    async create (createCollectionProjectDto: CreateCollectionProjectDto) {
        await this.assertUnique(createCollectionProjectDto.project_name)
        const data = omit(createCollectionProjectDto, ['id', 'project_id'])
        const saveData = this.collectionProjectRepository.create(data)
        return await this.collectionProjectRepository.save(saveData)
    }

    async findOne (id: number) {
        return await this.collectionProjectRepository.findOne(id)
    }

    async update (id: number, updateCollectionProjectDto: UpdateCollectionProjectDto) {
        const data = await this.collectionProjectRepository.findOne(id)
        if (data) {
            await this.assertUnique(updateCollectionProjectDto.project_name, id)
            const updateData = omit(updateCollectionProjectDto, ['id', 'project_id', 'create_time', 'creator_id', 'creator_name'])
            await this.collectionProjectRepository.update(id, updateData)
            return '更新成功'
        } else {
            throw new HttpException('更新失败, 数据不存在', HttpStatus.OK)
        }
    }

    async remove (id: number) {
        const result = await this.collectionProjectRepository.delete(id)
        if (result.affected) {
            return '删除成功'
        } else {
            throw new HttpException('删除失败, 数据不存在', HttpStatus.OK)
        }
    }

    async generateSecret (id: number) {
        const project = await this.collectionProjectRepository.findOne(id)
        if (!project) {
            throw new HttpException('生成失败, 项目不存在', HttpStatus.OK)
        }
        const raw = `${project.project_id}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
        const app_secret = aesEncrypt(raw)
        await this.collectionProjectRepository.update(id, { app_secret })
        return { app_secret }
    }

    decryptAppSecret (app_secret: string) {
        if (!app_secret) {
            throw new HttpException('参数缺失: app_secret 不能为空', HttpStatus.OK)
        }
        return aesDecrypt(app_secret)
    }

    async isProjectNameUnique (project_name: string, excludeId?: number): Promise<{ unique: boolean }> {
        if (!project_name) {
            throw new HttpException('参数错误: project_name 不能为空', HttpStatus.OK)
        }
        const existed = await this.collectionProjectRepository.findOne({ where: { project_name } })
        if (!existed) {
            return { unique: true }
        }
        if (excludeId && existed.id === excludeId) {
            return { unique: true }
        }
        return { unique: false }
    }

    async getProjectIdByAppSecret (app_secret: string): Promise<string> {
        if (!app_secret) {
            throw new HttpException('参数缺失: app_secret 不能为空', HttpStatus.OK)
        }
        const project = await this.collectionProjectRepository.findOne({ where: { app_secret } })
        if (!project) {
            throw new HttpException('项目不存在或密钥无效', HttpStatus.OK)
        }
        return project.project_id
    }

    async getListByPage (params: pageListCollectionProjectDto) {
        const { size = 10, current = 1 } = params
        const queryParams: listCollectionProjectDto = omit(params, ['size', 'current'])
        const [data, total] = await getConnection()
            .createQueryBuilder(CollectionProjectEntity, 'cp')
            .skip((current - 1) * size)
            .take(size)
            .where(addDtoParams(queryParams))
            .getManyAndCount()
        const safeData = data.map(item => omit(item, ['app_secret']))
        return {
            data: safeData as any,
            total,
            pageSize: +size,
            pageNumber: +current
        }
    }

    getList (params: listCollectionProjectDto) {
        return getConnection()
            .createQueryBuilder(CollectionProjectEntity, 'cp')
            .where(addDtoParams(params))
            .getMany()
            .then(list => list.map(item => omit(item, ['app_secret'])) as any)
    }
}
