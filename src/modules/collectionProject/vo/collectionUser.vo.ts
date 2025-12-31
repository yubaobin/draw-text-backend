import { PartialType } from '@nestjs/swagger'
import { CollectionUserDto } from '../dto/collectionUser.dto'

export class CollectionUserVo extends PartialType(CollectionUserDto) {}
