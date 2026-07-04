import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

let client
async function getDb() {
    if (!client) {
        client = new MongoClient(process.env.MONGO_URL)
        await client.connect()
    }
    const dbName = process.env.DB_NAME || 'zplore'
    return client.db(dbName)
}

export async function GET(request, { params }) {
    const p = (await params)?.path || []
    const route = '/' + (p?.join('/') || '')

    if (route === '/' || route === '/health' || route === '') {
        return NextResponse.json({ message: 'Zplore API online', ts: Date.now() })
    }
    if (route === '/contact') {
        try {
            const db = await getDb()
            const docs = await db.collection('contact_submissions').find({}, { projection: { _id: 0 } }).sort({ ts: -1 }).limit(50).toArray()
            return NextResponse.json({ items: docs })
        } catch (e) {
            return NextResponse.json({ items: [], error: String(e) }, { status: 200 })
        }
    }
    return NextResponse.json({ error: 'not found' }, { status: 404 })
}

export async function POST(request, { params }) {
    const p = (await params)?.path || []
    const route = '/' + (p?.join('/') || '')
    if (route === '/contact') {
        try {
            const body = await request.json()
            const doc = { id: crypto.randomUUID(), ts: Date.now(), ...body }
            const db = await getDb()
            await db.collection('contact_submissions').insertOne(doc)
            return NextResponse.json({ ok: true, id: doc.id })
        } catch (e) {
            return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
        }
    }
    return NextResponse.json({ error: 'not found' }, { status: 404 })
}
