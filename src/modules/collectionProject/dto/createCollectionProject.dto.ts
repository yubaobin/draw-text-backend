import { PartialType } from '@nestjs/swagger'
import { CollectionProjectDto } from './collectionProject.dto'

export class CreateCollectionProjectDto extends PartialType(CollectionProjectDto) {}
