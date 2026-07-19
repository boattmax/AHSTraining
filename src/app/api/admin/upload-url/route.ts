import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json({ message: 'fileName is required' }, { status: 400 });
    }

    // Generate a unique file name to avoid collisions
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Create a signed upload URL for the 'videos' bucket
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .storage
      .from('videos')
      .createSignedUploadUrl(uniqueFileName);

    if (error) {
      console.error('Supabase signed URL error:', error);
      return NextResponse.json({ message: 'Failed to create upload URL' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      // Public URL that will be saved to the database (assuming bucket is public)
      publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${data.path}`
    });

  } catch (error) {
    console.error('Upload URL error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
