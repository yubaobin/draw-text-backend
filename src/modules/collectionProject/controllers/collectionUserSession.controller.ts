import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/modules/common/base.controller'
import { CollectionUserSessionService } from '../services/collectionUserSession.service'
import { CollectionProjectService } from '../services/collectionProject.service'
import { CreateCollectionUserSessionDto } from '../dto/createCollectionUserSession.dto'
import { UpdateCollectionUserSessionDto } from '../dto/updateCollectionUserSession.dto'
import { pageListCollectionUserSessionDto } from '../dto/listCollectionUserSession.dto'
import { ListCollectionUserSessionVo } from '../vo/listCollectionUserSession.vo'
import { CollectionUserSessionVo } from '../vo/collectionUserSession.vo'
import { IpAddress } from '@/decorators/ip.address'
import { Public } from '@/decorators/api.auth'

@ApiTags('用户信息收集-会话')
@Controller('sessions')
export class CollectionUserSessionController extends BaseController {
    constructor (
        private readonly collectionUserSessionService: CollectionUserSessionService,
        private readonly collectionProjectService: CollectionProjectService
    ) {
        super()
    }

    @ApiOperation({ summary: '创建会话' })
    @ApiOkResponse({ description: 'session_id' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post()
    async create (
        @Headers('uxdc-app-secret') appSecret: string,
        @IpAddress() ip_address: string,
        @Body() payload: CreateCollectionUserSessionDto
    ) {
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionUserSessionService.create(project_id, payload, ip_address)
    }

    @ApiOperation({ summary: '更新会话（心跳/活动）' })
    @ApiOkResponse({ description: 'session_id' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Patch(':session_id')
    update (@Param('session_id') session_id: string, @Body() payload: UpdateCollectionUserSessionDto) {
        return this.collectionUserSessionService.update(session_id, payload)
    }

    @ApiOperation({ summary: '查询会话列表' })
    @ApiOkResponse({ type: ListCollectionUserSessionVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get()
    async getListByPage (@Headers('uxdc-app-secret') appSecret: string, @Query() params: pageListCollectionUserSessionDto): Promise<ListCollectionUserSessionVo> {
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionUserSessionService.getListByPage(project_id, params) as any
    }

    @ApiOperation({ summary: '获取会话详情' })
    @ApiOkResponse({ type: CollectionUserSessionVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get(':session_id')
    findOne (@Param('session_id') session_id: string) {
        return this.collectionUserSessionService.findOne(session_id)
    }
}
