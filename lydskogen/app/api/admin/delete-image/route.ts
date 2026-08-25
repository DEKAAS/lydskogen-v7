import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    // Verify Supabase connection
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server configuration error: Supabase client not initialized" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
    }

    // Extract the path from the URL
    // Example URL: https://xyz.supabase.co/storage/v1/object/public/artwork-images/content/about_bg_image_123.jpg
    // We need: content/about_bg_image_123.jpg
    
    // Detect bucket from URL if possible, otherwise default to artwork-images
    let bucket = 'artwork-images';
    let path = '';

    if (url.includes('/artwork-images/')) {
      path = url.split('/artwork-images/')[1];
      bucket = 'artwork-images';
    } else if (url.includes('/music-files/')) {
        // Should generally not delete music files this way, but just in case
        path = url.split('/music-files/')[1];
        bucket = 'music-files';
    } else {
        // Try to parse generic supabase storage url structure
        const parts = url.split('/object/public/');
        if (parts.length > 1) {
            const pathParts = parts[1].split('/');
            bucket = pathParts[0];
            path = pathParts.slice(1).join('/');
        }
    }

    if (!path) {
        return NextResponse.json({ error: "Could not parse file path from URL" }, { status: 400 });
    }

    console.log(`Deleting file: bucket=${bucket}, path=${path}`);

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Supabase storage delete error:', error);
      return NextResponse.json({ error: "Failed to delete image from storage" }, { status: 500 });
    }

    return NextResponse.json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ 
      error: "Error deleting image",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
