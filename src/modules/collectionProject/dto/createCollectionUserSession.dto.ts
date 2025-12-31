import { PartialType } from '@nestjs/swagger'
import { CollectionUserSessionDto } from './collectionUserSession.dto'

export class CreateCollectionUserSessionDto extends PartialType(CollectionUserSessionDto) {}
