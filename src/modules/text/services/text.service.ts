import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { omit } from 'lodash'
import { Repository } from 'typeorm'
import { TextDto } from '../controllers/dto/text.dto'
import { UpdateTextDto } from '../controllers/dto/update.text.dto'
import { TextVo } from '../controllers/vo/text.vo'
import { TextEntity } from '../entities/text.entity'

@Injectable()
export class TextService {
    constructor (
        @InjectRepository(TextEntity)
        private readonly textRepository: Repository<TextEntity>
    ) { }
    /**
     * 图片图片
     * @param textDto 
     * @returns 
     */
    async createText (textDto: UpdateTextDto): Promise<TextEntity> {
        const data: TextDto = omit(textDto, 'id')
        const text = this.textRepository.create(data)
        return await this.textRepository.save(text)
    }

    /**
     * 删除
     * @param id 
     */
    async deleteTextById (id: number): Promise<string> {
        const result = await this.textRepository.delete(id)
        if (result.affected) {
            return '删除成功'
        } else {
            throw new HttpException('删除失败, 数据不存在', HttpStatus.OK)
        }
    }

    /**
     * 更新
     * @param textDto 
     */
    async updateText (textDto: UpdateTextDto): Promise<string> {
        const { id } = textDto
        if (id) {
            await this.textRepository.update(id, textDto)
            return '更新成功'
        } else {
            throw new HttpException('更新失败, 数据不存在', HttpStatus.OK)
        }
    }
    /**
     * 根据id
     * @param id 
     * @returns 
     */
    async textById (id: number): Promise<TextVo> {
        const text = await this.textRepository.findOne(id)
        if (!text) {
            throw new HttpException('数据不存在', HttpStatus.OK)
        }
        return text
    }
}
