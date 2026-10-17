import { test } from 'node:test'
import assert from 'node:assert/strict'
import { submitBooking, shopToday } from '../src/booking.js'
const form = { fullName: ' Test User ', phone: '+905550000000', service: 'Saç Kesimi', date: '2099-01-01', time: '10:00', email: '', note: '' }
test('sends same-origin JSON and accepts only a created response', async () => {
    const result = await submitBooking(form, async (url, options) => {
        assert.equal(url, '/api/appointments')
        assert.equal(options.method, 'POST')
        assert.equal(JSON.parse(options.body).fullName, 'Test User')
        assert.equal(JSON.parse(options.body).time, '10:00')
        return { status: 201, json: async () => ({ id: 1 }) }
    })
    assert.deepEqual(result, { id: 1 })
})
test('rejects whitespace-only required fields before calling API', async () => {
    await assert.rejects(submitBooking({ ...form, fullName: ' ' }, () => assert.fail()), /gerekli/)
})
test('conflicts, invalid input, server errors and network errors never confirm', async () => {
    for (const status of [400, 409, 500, 200]) {
        await assert.rejects(submitBooking(form, async () => ({ status })))
    }
    await assert.rejects(submitBooking(form, async () => { throw new Error('network') }), /ulaşılamadı/)
})
test('calendar minimum uses shop timezone at UTC day boundary', () => {
    assert.equal(shopToday(new Date('2026-01-01T22:00:00Z')), '2026-01-02')
})
