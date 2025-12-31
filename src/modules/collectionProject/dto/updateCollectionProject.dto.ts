import { PartialType } from '@nestjs/swagger'
import { CollectionProjectDto } from './collectionProject.dto'

export class UpdateCollectionProjectDto extends PartialType(CollectionProjectDto) {}
