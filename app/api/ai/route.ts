import { NextResponse } from 'next/server';
import { askHostelAI } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const response = await askHostelAI(query);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process AI query' }, { status: 500 });
  }
}
