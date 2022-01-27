import { ApiAuth } from '@/decorators/api.auth'
import { AuthGuard } from '@/guard/auth/auth.guard'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { TextEntity } from '../entities/text.entity'
import { TextService } from '../services/text.service'
import { TextDto } from './dto/text.dto'
import { UpdateTextDto } from './dto/update.text.dto'
import { TextVo } from './vo/text.vo'

@ApiTags('文字管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('text')
export class TextController {
    constructor (private readonly textService: TextService) {}
   
    @ApiOperation({ summary: '新增文字', description: '新增文字' })
    @ApiOkResponse({ type: TextDto, description: '创建图片返回值' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createText (@Body() textDto: UpdateTextDto): Promise<TextEntity> {
        return await this.textService.createText(textDto)
    }

    @ApiOperation({ summary: '删除图片', description: '资源ID删除图片' })
    @ApiOkResponse({ type: Boolean, description: '删除图片返回值' })
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteTextById (@Param('id', new ParseIntPipe()) id: number): Promise<string> {
        return await this.textService.deleteTextById(id)
    }

    @ApiOperation({ summary: '更新图片', description: '更新图片' })
    @ApiOkResponse({ type: Boolean, description: '更新图片返回值' })
    @Put()
    @HttpCode(HttpStatus.OK)
    async updateTextById (@Body() textDto: UpdateTextDto) {
        return await this.textService.updateText(textDto)
    }

    @ApiOperation({ summary: '查询文字信息', description: '根据id查询文字信息' })
    @ApiOkResponse({
        type: UpdateTextDto,
        description: '查询单条账号返回值'
    })
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async accountById (@Param('id', new ParseIntPipe()) id: number): Promise<TextVo> {
        return await this.textService.textById(id)
    }
}
