import { NextResponse } from 'next/server';
import soundCloud from '../../../../scraper/soundcloud';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    if (!q) return NextResponse.json({ status: false, message: 'Query parameter required' }, { status: 400 });
    const result = await soundCloud.search(q);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}