import { Module, Global } from '@nestjs/common'
import { InitDbService } from './services/init-db/init-db.service'

@Global()
@Module({
    imports: [],
    providers: [InitDbService],
    exports: []
})
export class SharedModule {}
