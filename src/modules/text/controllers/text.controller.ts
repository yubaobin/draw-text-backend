import { Controller, Post } from '@nestjs/common'
import { TextService } from '../services/text.service'

@Controller('text')
export class TextController {
    constructor (private readonly textService: TextService) {}
    @Post('/analyze')
    analyze () {
        return this.textService.analyze()
    }
}
