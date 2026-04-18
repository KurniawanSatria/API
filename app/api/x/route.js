import { NextResponse } from 'next/server';
import X from '../../../scraper/x';

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ status: false, message: 'URL parameter required' }, { status: 400 });
    const result = await X(url);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}