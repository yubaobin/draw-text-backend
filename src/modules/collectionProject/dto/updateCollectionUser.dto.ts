import { PartialType } from '@nestjs/swagger'
import { CollectionUserDto } from './collectionUser.dto'

export class UpdateCollectionUserDto extends PartialType(CollectionUserDto) {}
