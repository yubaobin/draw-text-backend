import { UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@/guard/auth/auth.guard'
import { ApiAuth } from '@/decorators/api.auth'

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
export class BaseController {

}
