import { PartialType } from '@nestjs/swagger'
import { CollectionUserDto } from './collectionUser.dto'

export class UpsertCollectionUserDto extends PartialType(CollectionUserDto) {}
