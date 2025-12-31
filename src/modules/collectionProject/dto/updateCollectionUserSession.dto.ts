import { PartialType } from '@nestjs/swagger'
import { CollectionUserSessionDto } from './collectionUserSession.dto'

export class UpdateCollectionUserSessionDto extends PartialType(CollectionUserSessionDto) {}
