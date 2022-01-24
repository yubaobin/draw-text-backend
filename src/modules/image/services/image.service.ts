import { Injectable } from '@nestjs/common'

@Injectable()
export class ImageService { 
    analyze () {
        return 'service analyze'
    }
}
