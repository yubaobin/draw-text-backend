import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/modules/common/base.controller'
import { CollectionEventService } from '../services/collectionEvent.service'
import { CollectionProjectService } from '../services/collectionProject.service'
import { PageViewEventDto } from '../dto/pageViewEvent.dto'
import { PageLeaveEventDto } from '../dto/pageLeaveEvent.dto'
import { DomEventDto } from '../dto/domEvent.dto'
import { CustomEventDto } from '../dto/customEvent.dto'
import { EventIdVo } from '../vo/eventId.vo'
import { Public } from '@/decorators/api.auth'

@ApiTags('用户信息收集-事件')
@Controller('events')
export class CollectionEventController extends BaseController {
    constructor (
        private readonly collectionEventService: CollectionEventService,
        private readonly collectionProjectService: CollectionProjectService
    ) {
        super()
    }

    @ApiOperation({ summary: '页面访问（PV）' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('page-view')
    async createPageView (@Headers('uxdc-app-secret') appSecret: string, @Body() payload: PageViewEventDto): Promise<EventIdVo> {
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.createPageView(project_id, payload) as any
    }

    @ApiOperation({ summary: '页面访问（PV，GET方式）' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get('page-view')
    async createPageViewByGet (
        @Headers('uxdc-app-secret') headerSecret: string,
        @Query('uxdc-app-secret') querySecret: string,
        @Query() payload: PageViewEventDto
    ): Promise<EventIdVo> {
        const appSecret = headerSecret || querySecret
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.createPageView(project_id, payload) as any
    }

    @ApiOperation({ summary: '页面停留（离开时上报）' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Post('page-leave')
    @Public()
    async updatePageStayDuration (
        @Headers('uxdc-app-secret') headerSecret: string,
        @Query('uxdc-app-secret') querySecret: string,
        @Body() payload: PageLeaveEventDto
    ): Promise<EventIdVo> {
        const appSecret = headerSecret || querySecret
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.updatePageStayDuration(project_id, payload) as any
    }

    @ApiOperation({ summary: '页面停留（GET方式离开上报）' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get('page-leave')
    async updatePageStayDurationByGet (
        @Headers('uxdc-app-secret') headerSecret: string,
        @Query('uxdc-app-secret') querySecret: string,
        @Query() payload: PageLeaveEventDto
    ): Promise<EventIdVo> {
        const appSecret = headerSecret || querySecret
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.updatePageStayDuration(project_id, payload) as any
    }

    @ApiOperation({ summary: 'DOM事件' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('click')
    async createDomEvent (@Headers('uxdc-app-secret') appSecret: string, @Body() payload: DomEventDto): Promise<EventIdVo> {
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.createDomEvent(project_id, payload) as any
    }

    @ApiOperation({ summary: 'DOM事件（GET方式）' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get('click')
    async createDomEventByGet (
        @Headers('uxdc-app-secret') headerSecret: string,
        @Query('uxdc-app-secret') querySecret: string,
        @Query() payload: DomEventDto
    ): Promise<EventIdVo> {
        const appSecret = headerSecret || querySecret
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.createDomEvent(project_id, payload) as any
    }

    @ApiOperation({ summary: '自定义事件' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('custom')
    async createCustomEvent (@Headers('uxdc-app-secret') appSecret: string, @Body() payload: CustomEventDto): Promise<EventIdVo> {
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.createCustomEvent(project_id, payload) as any
    }

    @ApiOperation({ summary: '自定义事件（GET方式）' })
    @ApiOkResponse({ type: EventIdVo })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Get('custom')
    async createCustomEventByGet (
        @Headers('uxdc-app-secret') headerSecret: string,
        @Query('uxdc-app-secret') querySecret: string,
        @Query() payload: CustomEventDto
    ): Promise<EventIdVo> {
        const appSecret = headerSecret || querySecret
        const project_id = await this.collectionProjectService.getProjectIdByAppSecret(appSecret)
        return this.collectionEventService.createCustomEvent(project_id, payload) as any
    }
}
