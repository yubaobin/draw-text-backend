import { Injectable } from '@nestjs/common'

@Injectable()
export class TextService { 
    analyze () {
        return 'service analyze'
    }
}
