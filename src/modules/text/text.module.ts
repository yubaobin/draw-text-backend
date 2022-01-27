import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TextController } from './controllers/text.controller'
import { TextEntity } from './entities/text.entity'
import { TextService } from './services/text.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			TextEntity
		])
	],
	controllers: [TextController],
	providers: [TextService]
})
export class TextModule { }
