import { NextResponse } from 'next/server';
import SoundCloud from '../../../../scraper/soundcloud';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url) return NextResponse.json({ status: false, message: 'URL parameter required' }, { status: 400 });
    const result = await SoundCloud(url);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message }, { status: 500 });
  }
}