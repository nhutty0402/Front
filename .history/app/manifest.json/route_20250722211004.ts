// app/manifest.json/route.ts
import { NextResponse } from 'next/server';
import manifest from '@/../';

export async function GET() {
  return NextResponse.json(manifest);
}
