import fs from 'fs';
import path from 'path';
import type { TestContent } from '../scoring/contract';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function loadContent(slug: string): TestContent | null {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`[loader] Content file not found: ${filePath}`);
      return null;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw) as TestContent;
    return data;
  } catch (err) {
    console.error(`[loader] Failed to load content for slug '${slug}':`, err);
    return null;
  }
}

export function listSlugs(): string[] {
  try {
    if (!fs.existsSync(CONTENT_DIR)) return [];
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith('.json') && f !== 'products.json')
      .map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

export function loadAllContent(): TestContent[] {
  const slugs = listSlugs();
  const contents: TestContent[] = [];
  for (const slug of slugs) {
    const content = loadContent(slug);
    if (content) contents.push(content);
  }
  return contents;
}
