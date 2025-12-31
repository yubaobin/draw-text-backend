import { IntersectionType } from '@nestjs/swagger'
import { QueryOptionsDto } from '@/dto/query.options.dto'
import { CollectionUserDto } from './collectionUser.dto'

export class listCollectionUserDto extends CollectionUserDto {}

export class pageListCollectionUserDto extends IntersectionType(listCollectionUserDto, QueryOptionsDto) {}
