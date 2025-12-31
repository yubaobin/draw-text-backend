import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/modules/common/base.controller'
import { CollectionProjectService } from '../services/collectionProject.service'
import { CreateCollectionProjectDto } from '../dto/createCollectionProject.dto'
import { UpdateCollectionProjectDto } from '../dto/updateCollectionProject.dto'
import { pageListCollectionProjectDto, listCollectionProjectDto } from '../dto/listCollectionProject.dto'
import { listCollectionProjectVo } from '../vo/listCollectionProject.vo'
import { CollectionProjectVo } from '../vo/collectionProject.vo'

@ApiTags('用户信息收集项目管理')
@Controller('collectionProject')
export class CollectionProjectController extends BaseController {
    constructor (private readonly collectionProjectService: CollectionProjectService) {
        super()
    }

    @ApiOperation({
        summary: '获取项目列表',
        description: '获取项目列表(分页)'
    })
    @ApiOkResponse({ type: listCollectionProjectVo, description: '分页获取列表' })
    @HttpCode(HttpStatus.OK)
    @Get('/getListByPage')
    getListByPage (@Query() params: pageListCollectionProjectDto): Promise<listCollectionProjectVo> {
        return this.collectionProjectService.getListByPage(params)
    }

    @ApiOperation({
        summary: '获取项目列表',
        description: '获取项目列表(不分页)'
    })
    @ApiOkResponse({ type: CollectionProjectVo, isArray: true, description: '获取列表(不分页)' })
    @HttpCode(HttpStatus.OK)
    @Get('/getList')
    getList (@Query() params: listCollectionProjectDto): Promise<CollectionProjectVo[]> {
        return this.collectionProjectService.getList(params)
    }

    @ApiOperation({
        summary: '新增项目',
        description: '新增项目'
    })
    @HttpCode(HttpStatus.OK)
    @Post()
    create (@Body() createCollectionProject: CreateCollectionProjectDto) {
        return this.collectionProjectService.create(createCollectionProject)
    }

    @ApiOperation({
        summary: '根据id获取项目',
        description: '根据id获取项目'
    })
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    findOne (@Param('id') id: string) {
        return this.collectionProjectService.findOne(+id)
    }

    @ApiOperation({
        summary: '更新项目',
        description: '更新项目'
    })
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    update (@Param('id') id: string, @Body() updateCollectionProjectDto: UpdateCollectionProjectDto) {
        return this.collectionProjectService.update(+id, updateCollectionProjectDto)
    }

    @ApiOperation({
        summary: '删除项目',
        description: '删除项目'
    })
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    remove (@Param('id') id: string) {
        return this.collectionProjectService.remove(+id)
    }

    @ApiOperation({
        summary: '生成/重置项目应用密钥',
        description: '为指定项目生成新的 app_secret 并保存'
    })
    @ApiOkResponse({ description: '新生成的 app_secret' })
    @HttpCode(HttpStatus.OK)
    @Post(':id/generateSecret')
    generateSecret (@Param('id') id: string) {
        return this.collectionProjectService.generateSecret(+id)
    }

    @ApiOperation({
        summary: '检测项目名称是否唯一',
        description: '根据项目名称检测是否唯一，可传 excludeId 排除当前记录'
    })
    @ApiOkResponse({ description: '唯一性结果: { unique: boolean }' })
    @HttpCode(HttpStatus.OK)
    @Get('/checkProjectNameUnique')
    checkProjectNameUnique (@Query('project_name') project_name: string, @Query('excludeId') excludeId?: string) {
        return this.collectionProjectService.isProjectNameUnique(project_name, excludeId ? +excludeId : undefined)
    }
}
