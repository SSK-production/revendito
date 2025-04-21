import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'swagger.json');
  const fileContents = readFileSync(filePath, 'utf-8');
  const json = JSON.parse(fileContents);

  return NextResponse.json(json);
}
