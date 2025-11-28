import { describe, it, expect, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('imports', () => {
	it('module files exist', () => {
		const modelPath = path.resolve(__dirname, '../models/eventModel.js')
		const controllerPath = path.resolve(__dirname, '../controllers/eventController.js')

		expect(fs.existsSync(modelPath)).toBe(true)
		expect(fs.existsSync(controllerPath)).toBe(true)
	})

	it('can import eventModel when mongoose is mocked', async () => {
		vi.resetModules()
		vi.doMock('mongoose', () => ({
			Schema: class {},
			model: (name, schema) => {
				const MockModel = function () {}
				MockModel.create = async (payload) => payload
				MockModel.find = async () => []
				MockModel.findById = async () => null
				MockModel.findByIdAndUpdate = async () => null
				MockModel.findByIdAndDelete = async () => null
				return MockModel
			}
		}))

		const mod = await import('../models/eventModel.js')
		const eventModel = mod.default || mod
		expect(typeof eventModel).toBe('function')
		expect(typeof eventModel.create).toBe('function')
	})

	it('can import eventController when model is mocked', async () => {
		vi.resetModules()
		vi.doMock('../models/eventModel.js', () => ({
			create: vi.fn(),
			find: vi.fn(),
			findById: vi.fn(),
			findByIdAndUpdate: vi.fn(),
			findByIdAndDelete: vi.fn()
		}))

		const mod = await import('../controllers/eventController.js')
		const controller = mod.default || mod

		expect(typeof controller.createEvent).toBe('function')
		expect(typeof controller.getAllEvents).toBe('function')
		expect(typeof controller.getEventById).toBe('function')
		expect(typeof controller.updateEvent).toBe('function')
		expect(typeof controller.deleteEvent).toBe('function')
	})
})

