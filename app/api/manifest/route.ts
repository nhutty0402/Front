// app/api/manifest/route.ts
import { NextResponse } from 'next/server';
import manifest from '@/../../public/manifest.json'; // import từ public

export async function GET() {
  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}
