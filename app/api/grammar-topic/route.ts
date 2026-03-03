import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

const BASE_DIR = path.resolve(
  process.cwd(),
  'app',
  'skill',
  'grammar',
  'GrammarForSpeaking',
  'data',
  'topics'
);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isSafeSlug = (value: string) => SLUG_PATTERN.test(value);

const isInsideBaseDir = (targetPath: string) => {
  const normalizedBase = path.normalize(BASE_DIR);
  const normalizedTarget = path.normalize(targetPath);
  return (
    normalizedTarget === normalizedBase ||
    normalizedTarget.startsWith(`${normalizedBase}${path.sep}`)
  );
};

const resolveSafeTopicDir = async (category: string, topic: string) => {
  if (!isSafeSlug(category) || !isSafeSlug(topic)) return null;

  let categoryEntries: Array<{ name: string; isDirectory: () => boolean }> = [];
  try {
    categoryEntries = await fs.readdir(BASE_DIR, { withFileTypes: true });
  } catch {
    return null;
  }

  const categoryExists = categoryEntries.some(
    (entry) => entry.isDirectory() && entry.name === category
  );
  if (!categoryExists) return null;

  const categoryDir = path.resolve(BASE_DIR, category);
  if (!isInsideBaseDir(categoryDir)) return null;

  let topicEntries: Array<{ name: string; isDirectory: () => boolean }> = [];
  try {
    topicEntries = await fs.readdir(categoryDir, { withFileTypes: true });
  } catch {
    return null;
  }

  const topicExists = topicEntries.some(
    (entry) => entry.isDirectory() && entry.name === topic
  );
  if (!topicExists) return null;

  const topicDir = path.resolve(categoryDir, topic);
  if (!isInsideBaseDir(topicDir)) return null;

  return topicDir;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.trim() ?? '';
  const topic = searchParams.get('topic')?.trim() ?? '';

  if (!category || !topic) {
    return NextResponse.json(
      { error: 'Query `category` dan `topic` wajib diisi.' },
      { status: 400 }
    );
  }

  const topicDir = await resolveSafeTopicDir(category, topic);
  if (!topicDir) {
    return NextResponse.json(
      { error: 'Parameter `category` atau `topic` tidak valid.' },
      { status: 400 }
    );
  }

  const metaPath = path.resolve(topicDir, 'meta.json');
  const topicPath = path.resolve(topicDir, 'topic.md');

  if (!isInsideBaseDir(metaPath) || !isInsideBaseDir(topicPath)) {
    return NextResponse.json(
      { error: 'Akses path tidak diizinkan.' },
      { status: 403 }
    );
  }

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
