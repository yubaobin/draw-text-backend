import { ImageListVo, ImageVo } from '../controllers/vo/image.vo'
import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { getConnection, Repository } from 'typeorm'
import { UpdateImageDto } from '../controllers/dto/update.image.dto'
import { ImageEntity } from '../entities/image.entity'
import { ImageReqListDto } from '../controllers/dto/image.req.dto'
import { PageEnum } from '@/enums/page.enum'
import { ConfigService } from 'nestjs-config'
import { getIpAddress } from '@/utils'
import { checkFolder, deleteFile, getFileName, getFileSuffix } from '@/utils/file'
import { createReadStream, createWriteStream, statSync } from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { ImageDto } from '../controllers/dto/image.dto'
import tesseract from 'tesseract.js'

const dataPath = path.resolve(process.cwd(), 'traineddata')

const worker = tesseract.createWorker({
    cacheMethod: 'none', // refresh
    langPath: dataPath,
    logger: (m: any) => console.log(m)
})

@Injectable()
export class ImageService {
    constructor (
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly configService: ConfigService
    ) { }

    getUploadPath (): string {
        return path.resolve(process.cwd(), this.configService.get('system.uploadpath') || 'upload')
    }
    getUploadIp (): string {
        return this.configService.get('system.uploadip') || getIpAddress()
    }
    /**
     * 新增图片
     * @param imageDto 
     * @returns 
     */
    async createImage (imageDto: UpdateImageDto): Promise<ImageEntity> {
        const data: ImageDto = omit(imageDto, 'id')
        const image = this.imageRepository.create(data)
        return await this.imageRepository.save(image)
    }

    /**
     * 删除
     * @param id 
     */
    async deleteImageById (id: number): Promise<string> {
        const imageEntity: ImageEntity | undefined = await this.imageRepository.findOne(id)
        if (imageEntity) {
            const folder = this.getUploadPath()
            const fileurl = path.resolve(folder, getFileName(imageEntity.fileurl))
            await deleteFile(fileurl)
        }
        const result = await this.imageRepository.delete(id)
        if (result.affected) {
            return '删除成功'
        } else {
            throw new HttpException('删除失败, 数据不存在', HttpStatus.OK)
        }
    }

    /**
     * 更新
     * @param imageDto 
     */
    async updateImage (imageDto: UpdateImageDto): Promise<string> {
        const { id } = imageDto
        if (id) {
            await this.imageRepository.update(id, imageDto)
            return '更新成功'
        } else {
            throw new HttpException('更新失败, 数据不存在', HttpStatus.OK)
        }
    }

    /**
     * 不分页查询
     * @returns 
     */
    async imageList (): Promise<ImageVo[]> {
        return this.imageRepository.find()
    }

    /**
     * 分页查询
     * @returns 
     */
    async imageListPage (imageReqDto: ImageReqListDto): Promise<ImageListVo> {
        const { size = PageEnum.PAGE_SIZE, current = PageEnum.PAGE_NUMBER, type = '' } = imageReqDto
        const builder = getConnection()
            .createQueryBuilder(ImageEntity, 'image')
            .skip((current - 1) * size)
            .take(size)
            .orderBy({ 'image.sort': 'ASC', 'image.createdAt': 'DESC' })
        if (type) {
            builder.where('image.type = :type', { type })
        }    
        const [data, total] = await builder.printSql().getManyAndCount()
        return {
            data,
            total,
            current: parseInt(String(current)),
            size: parseInt(String(size))
        }
    }

    /**
     * 写入文件
     */
    writeFile (file: Express.Multer.File, folder: string, filename: string): Promise<string> {
        return new Promise((resolve: any, reject: any) => {
            const url = path.resolve(folder, filename) 
            const writeImage = createWriteStream(url)
            writeImage.write(file.buffer, (err: Error | null | undefined) => {
                if (err) {
                    reject(err)
                } else {
                    const ip = this.getUploadIp()
                    const prefix = this.configService.get('system.prefix')
                    let configPort = this.configService.get('system.port')
                    configPort = configPort ? `:${configPort}` : ''
                    resolve(`${ip}${configPort}/${prefix}/image/download/${filename}`)
                }
            })
        })
    }

    /**
     * 上传
     * @param file 
     */
    async upload (file: Express.Multer.File): Promise<string> {
        const folder = this.getUploadPath()
        try {
            await checkFolder(folder)
            const suffix = getFileSuffix(file.originalname)
            const filename = `${Date.now()}${suffix}`
            const filepath = await this.writeFile(file, folder, filename)
            return Promise.resolve(filepath)
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.OK)
        }
    }

    /**
     * 下载
     * @param filename
     */
    async download (filename: string): Promise<Readable | null> {
        const folder = this.getUploadPath()
        const fileStat = statSync(path.resolve(folder, filename))
        if (fileStat.isFile()) {
            const file = createReadStream(path.resolve(folder, filename))
            return new StreamableFile(file).getStream()
        } else {
            return null
        }
    }

    /**
     * 分析
     * @param file 
     */
    async analyze (file: Express.Multer.File, psm?: any): Promise<any> {
        await worker.load()
        await worker.loadLanguage('chi_sim')
        await worker.initialize('chi_sim', tesseract.OEM.TESSERACT_LSTM_COMBINED)
        await worker.setParameters({
            tessedit_pageseg_mode: psm || tesseract.PSM.SINGLE_WORD
        })
        const { data } = await worker.recognize(file.buffer)
        return data.text
    }
}
