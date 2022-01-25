import { ImageListVo, ImageVo } from '../controllers/vo/image.vo'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { getConnection, Repository } from 'typeorm'
import { UpdateImageDto } from '../controllers/dto/update.image.dto'
import { ImageEntity } from '../entities/image.entity'
import { ImageReqListDto } from '../controllers/dto/image.req.dto'
import { PageEnum } from '@/enums/page.enum'
@Injectable()
export class ImageService {
    constructor (
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>
    ) { }

    /**
     * 新增图片
     * @param imageDto 
     * @returns 
     */
    async createImage (imageDto: UpdateImageDto): Promise<string> {
        const data: any = omit(imageDto, 'id')
        const image = this.imageRepository.create(data)
        await this.imageRepository.save(image)
        return '新增成功'
    }

    /**
     * 删除
     * @param id 
     */
    async deleteImageById (id: number): Promise<string> {
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
    async updateImage (imageDto: UpdateImageDto) {
        const { id } = imageDto
        if (id) {
            const result = await this.imageRepository.update(id, imageDto)
            console.log(result)
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
            current,
            size
        }
    }
}
