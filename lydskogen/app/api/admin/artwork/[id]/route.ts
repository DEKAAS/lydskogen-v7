import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const metadataPath = path.join(process.cwd(), 'public', 'images', 'artwork', `${id}_metadata.json`);
    
    let existingData = {};
    try {
      const existingContent = await fs.readFile(metadataPath, 'utf8');
      existingData = JSON.parse(existingContent);
    } catch (e) {
      // File doesn't exist, use empty object
    }
    
    const updatedData = { ...existingData, ...body };
    await fs.writeFile(metadataPath, JSON.stringify(updatedData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update metadata' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    const metadataPath = path.join(process.cwd(), 'public', 'images', 'artwork', `${id}_metadata.json`);
    
    try {
      await fs.unlink(metadataPath);
    } catch (e) {
      // File might not exist
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete metadata' }, { status: 500 });
  }
}
