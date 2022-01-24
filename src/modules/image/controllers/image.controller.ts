import { Controller, Post } from '@nestjs/common'
import { ImageService } from '../services/image.service'

@Controller('Image')
export class ImageController {
    constructor (private readonly imageService: ImageService) {}
    @Post('/analyze')
    analyze () {
        return this.imageService.analyze()
    }
}
