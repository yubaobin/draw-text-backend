import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/modules/common/base.controller'
import { CollectionUserService } from '../services/collectionUser.service'
import { CollectionProjectService } from '../services/collectionProject.service'
import { UpsertCollectionUserDto } from '../dto/upsertCollectionUser.dto'
import { listCollectionUserDto } from '../dto/listCollectionUser.dto'
import { ListCollectionUserVo } from '../vo/listCollectionUser.vo'
import { CollectionUserVo } from '../vo/collectionUser.vo'
import { UpdateCollectionUserDto } from '../dto/updateCollectionUser.dto'
import { Public } from '@/decorators/api.auth'

@ApiTags('用户信息收集-用户')
@Controller('users')
export class CollectionUserController extends BaseController {
    constructor (
        private readonly collectionUserService: CollectionUserService,
        private readonly collectionProjectService: CollectionProjectService
    ) {
        super()
    }

    @ApiOperation({ summary: '创建/更新用户（Upsert）' })
    @ApiOkResponse({ description: 'project_id + user_uuid' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post()
    async upsertUser (@Headers('uxdc-app-secret') appSecret: string, @Body() payload: UpsertCollectionUserDto) {
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionUserService.upsertUser(project_id, payload)
    }

    @ApiOperation({ summary: '查询用户列表' })
    @ApiOkResponse({ type: ListCollectionUserVo, description: '分页获取列表' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get()
    async getListByPage (@Headers('uxdc-app-secret') appSecret: string, @Query() params: listCollectionUserDto): Promise<ListCollectionUserVo> {
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionUserService.getListByPage(project_id, params) as any
    }

    @ApiOperation({ summary: '获取用户详情' })
    @ApiOkResponse({ type: CollectionUserVo })
    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('/projects/:project_id/users/:user_uuid')
    findOne (@Param('project_id') project_id: string, @Param('user_uuid') user_uuid: string) {
        return this.collectionUserService.findOne(project_id, user_uuid)
    }

    @ApiOperation({ summary: '更新用户画像/累计指标' })
    @ApiOkResponse({ description: 'project_id + user_uuid' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Patch('/projects/:project_id/users/:user_uuid')
    updateUser (
        @Param('project_id') project_id: string,
        @Param('user_uuid') user_uuid: string,
        @Body() payload: UpdateCollectionUserDto
    ) {
        return this.collectionUserService.updateUser(project_id, user_uuid, payload)
    }
}
