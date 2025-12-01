import { describe, it, expect} from 'vitest'
import { createEvent, getEventById, deleteEvent, addParticipant } from '../controllers/eventController.js'

describe('tilføje event', () => {
	it(`skal tilføje et event`, () => {
		createEvent({"id": "1", "title": "test event", "date": "28-11-20925", "entryFee": "100", "location": "test location", "description": "this is a test event", "participants": "0", "eventPlanner": "test planner"})
		expect(getEventById(1) != null)}
)})

describe('tilføje user til event', () => {
	it(`skal tilføje en user til et event`, () => {
		addParticipant(1)
		expect(getEventById(1).participants == 1)}
)})

describe('fjerne event', () => {
	it(`skal fjerne et event`, () => {
		deleteEvent(1)
		expect(getEventById(1) == null)}
	)})