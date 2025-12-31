import { PartialType } from '@nestjs/swagger'
import { CollectionUserSessionDto } from '../dto/collectionUserSession.dto'

export class CollectionUserSessionVo extends PartialType(CollectionUserSessionDto) {}
