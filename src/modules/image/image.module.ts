import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImageController } from './controllers/image.controller'
import { ImageEntity } from './entities/image.entity'
import { ImageService } from './services/image.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ImageEntity
		])
	],
	controllers: [ImageController],
	providers: [ImageService]
})
export class ImageModule { }
