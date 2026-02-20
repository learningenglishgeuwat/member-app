import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

const BASE_DIR = path.join(
  process.cwd(),
  'app',
  'skill',
  'grammar',
  'GrammarForSpeaking',
  'data',
  'topics'
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const topic = searchParams.get('topic');

  if (!category || !topic) {
    return NextResponse.json(
      { error: 'Query `category` dan `topic` wajib diisi.' },
      { status: 400 }
    );
  }

  const topicDir = path.join(BASE_DIR, category, topic);
  const metaPath = path.join(topicDir, 'meta.json');
  const topicPath = path.join(topicDir, 'topic.md');

  try {
    const [metaRaw, content] = await Promise.all([
      fs.readFile(metaPath, 'utf8'),
      fs.readFile(topicPath, 'utf8'),
    ]);

    return NextResponse.json({
      meta: JSON.parse(metaRaw),
      content,
    });
  } catch {
    return NextResponse.json(
      { error: 'Data topic tidak ditemukan.' },
      { status: 404 }
    );
  }
}
