import { Test, TestingModule } from '@nestjs/testing'
import { TextController } from './text.controller'

describe('TextController', () => {
	let controller: TextController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TextController]
		}).compile()

		controller = module.get<TextController>(TextController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('analyze', () => {
		expect(controller.analyze()).toEqual('analyze')
	})
})
