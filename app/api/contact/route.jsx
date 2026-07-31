export async function POST(req) {
  const data = await req.json()
  console.log('Contact form submission:', data)
  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}