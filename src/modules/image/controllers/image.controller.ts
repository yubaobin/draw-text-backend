import { ImageListVo, ImageVo } from './vo/image.vo'
import { Body, Controller, Delete, Get, Header, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@/guard/auth/auth.guard'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiAuth } from '@/decorators/api.auth'
import { ImageService } from '../services/image.service'
import { UpdateImageDto } from './dto/update.image.dto'
import { ImageReqListDto } from './dto/image.req.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { getContentType } from '@/utils/file'
import { ImageDto } from './dto/image.dto'
import { FileUploadDto } from './dto/fileupload.dto'
import { ImageEntity } from '../entities/image.entity'

@ApiTags('图片管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('image')
export class ImageController {
    constructor (private readonly imageService: ImageService) { }

    @ApiOperation({ summary: '新增图片数据', description: '新增图片数据' })
    @ApiOkResponse({ type: UpdateImageDto, description: '创建图片返回值' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createImage (@Body() imageDto: UpdateImageDto): Promise<ImageEntity> {
        return await this.imageService.createImage(imageDto)
    }

    @ApiOperation({ summary: '删除图片', description: '资源ID删除图片' })
    @ApiOkResponse({ type: Boolean, description: '删除图片返回值' })
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteImageById (@Param('id', new ParseIntPipe()) id: number): Promise<string> {
        return await this.imageService.deleteImageById(id)
    }

    @ApiOperation({ summary: '更新图片', description: '更新图片' })
    @ApiOkResponse({ type: Boolean, description: '更新图片返回值' })
    @Put()
    @HttpCode(HttpStatus.OK)
    async updateImageById (@Body() imageDto: UpdateImageDto) {
        return await this.imageService.updateImage(imageDto)
    }

    @ApiOperation({ summary: '获取图片列表', description: '获取全部的图片列表(不分页)' })
    @ApiOkResponse({ type: ImageVo, isArray: true, description: '获取图片列表' })
    @HttpCode(HttpStatus.OK)
    @Get('/list')
    async imageList (): Promise<ImageVo[]> {
        return await this.imageService.imageList()
    }

    @ApiOperation({
        summary: '获取图片列表',
        description: '获取图片列表(分页)',
        externalDocs: {
            url: '/image/listByPage?pageSize=10&pageNumber=1'
        }
    })
    @ApiOkResponse({ type: ImageListVo, description: '分页获取资源列表' })
    @Get('/listByPage')
    async accessListPage (@Query() imageReqDto: ImageReqListDto): Promise<ImageListVo> {
        return await this.imageService.imageListPage(imageReqDto)
    }

    @ApiOperation({ summary: '上传图片', description: '上传图片' })
    @ApiOkResponse({ type: String, description: '图片路径' })
    @Post('/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of cats',
        type: FileUploadDto
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile (@UploadedFile() file: Express.Multer.File, @Body() imageDto: ImageDto): Promise<string> {
        const filepath = await this.imageService.upload(file)
        const imageData: ImageDto = {
            fileurl: filepath,
            cover: filepath,
            type: imageDto.type
        }
        await this.imageService.createImage(imageData)
        return filepath
    }

    @Header('cross-origin-resource-policy', 'cross-origin')
    @Get('/download/:filename')
    async downloadFile (@Param('filename') filename: string, @Res() res: Response) {
        try {
            const file: any = await this.imageService.download(filename)
            console.log('====', file)
            const contentType: string = getContentType(file.path)
            res.set({
                'Content-Type': contentType
            })
            file.pipe(res)   
        } catch (error) {
            res.send('')
        }
    }

    @ApiOperation({ summary: '解析图片', description: '解析图片' })
    @ApiOkResponse({ type: String, description: '图片路径' })
    @Post('/analyze')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of cats',
        type: FileUploadDto
    })
    @UseInterceptors(FileInterceptor('file'))
    async analyze (@UploadedFile() file: Express.Multer.File): Promise<string> {
        return await this.imageService.analyze(file)
    }
}
