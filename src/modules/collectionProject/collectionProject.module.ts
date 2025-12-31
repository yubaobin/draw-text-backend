import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CollectionProjectEntity } from './entities/collectionProject.entity'
import { CollectionProjectController } from './controllers/collectionProject.controller'
import { CollectionProjectService } from './services/collectionProject.service'
import { CollectionUserEntity } from './entities/collectionUser.entity'
import { CollectionUserController } from './controllers/collectionUser.controller'
import { CollectionUserService } from './services/collectionUser.service'
import { CollectionUserSessionEntity } from './entities/collectionUserSession.entity'
import { CollectionUserSessionController } from './controllers/collectionUserSession.controller'
import { CollectionUserSessionService } from './services/collectionUserSession.service'
import { CollectionPageViewEntity } from './entities/collectionPageView.entity'
import { CollectionDomEventEntity } from './entities/collectionDomEvent.entity'
import { CollectionCustomEventEntity } from './entities/collectionCustomEvent.entity'
import { CollectionEventController } from './controllers/collectionEvent.controller'
import { CollectionEventService } from './services/collectionEvent.service'
import { CollectionAnalyticsController } from './controllers/collectionAnalytics.controller'
import { CollectionAnalyticsService } from './services/collectionAnalytics.service'

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([
        CollectionProjectEntity,
        CollectionUserEntity,
        CollectionUserSessionEntity,
        CollectionPageViewEntity,
        CollectionDomEventEntity,
        CollectionCustomEventEntity
    ])],
    controllers: [
        CollectionProjectController,
        CollectionUserController,
        CollectionUserSessionController,
        CollectionEventController,
        CollectionAnalyticsController
    ],
    providers: [
        CollectionProjectService,
        CollectionUserService,
        CollectionUserSessionService,
        CollectionEventService,
        CollectionAnalyticsService
    ]
})
export class CollectionProjectModule {}
