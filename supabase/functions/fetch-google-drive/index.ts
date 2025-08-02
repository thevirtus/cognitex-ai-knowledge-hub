import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { folderId } = await req.json();

    if (!folderId) {
      throw new Error("Folder ID is required");
    }

    if (!GOOGLE_API_KEY) {
      console.log("GOOGLE_API_KEY not configured");
      return new Response(JSON.stringify({ 
        error: "Google Drive integration is not configured. Please contact your administrator to set up the Google API key.",
        files: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch files from Google Drive folder
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)&key=${GOOGLE_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google Drive API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const files = data.files || [];

    // For text files, also fetch their content
    const filesWithContent = await Promise.all(
      files.map(async (file: any) => {
        let content = '';
        
        // Only fetch content for text-based files under 10MB
        if (
          file.mimeType.includes('text/') || 
          file.mimeType.includes('application/json') ||
          file.mimeType === 'application/vnd.google-apps.document'
        ) {
          try {
            let contentUrl = '';
            
            if (file.mimeType === 'application/vnd.google-apps.document') {
              // Export Google Docs as plain text
              contentUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain&key=${GOOGLE_API_KEY}`;
            } else {
              // Download regular files
              contentUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${GOOGLE_API_KEY}`;
            }

            const contentResponse = await fetch(contentUrl);
            if (contentResponse.ok) {
              content = await contentResponse.text();
              // Limit content to first 5000 characters to avoid overwhelming the AI
              if (content.length > 5000) {
                content = content.substring(0, 5000) + '... [truncated]';
              }
            }
          } catch (error) {
            console.log(`Could not fetch content for file ${file.name}:`, error);
          }
        }

        return {
          ...file,
          content,
          size: file.size ? parseInt(file.size) : 0,
          sizeFormatted: file.size ? formatFileSize(parseInt(file.size)) : 'Unknown',
          lastModified: file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : 'Unknown'
        };
      })
    );

    return new Response(JSON.stringify({ 
      files: filesWithContent,
      totalFiles: filesWithContent.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-google-drive function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      files: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}