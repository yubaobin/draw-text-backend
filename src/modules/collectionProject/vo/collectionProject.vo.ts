import { OmitType } from '@nestjs/swagger'
import { CollectionProjectDto } from '../dto/collectionProject.dto'

export class CollectionProjectVo extends OmitType(CollectionProjectDto, ['app_secret'] as const) {}
