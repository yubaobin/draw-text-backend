import { Module } from '@nestjs/common'
import { TextController } from './controllers/text.controller'
import { TextService } from './services/text.service'

@Module({
  controllers: [TextController],
  providers: [TextService]
})
export class TextModule {}
