import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, documents, context } = await req.json();

    if (!question) {
      throw new Error("Question is required");
    }

    // Prepare context from documents
    const documentContext = documents?.map((doc: any, index: number) => 
      `Document ${index + 1} - ${doc.title}:\n${doc.content?.substring(0, 1000)}...`
    ).join('\n\n') || '';

    const systemPrompt = `You are Cognitex AI, an intelligent assistant that helps teams find information from their knowledge base. 

You have access to the team's documents and should provide helpful, accurate answers based on the available information. If you can't find relevant information in the provided documents, say so clearly.

Always be concise but thorough, and reference which documents you're drawing information from when possible.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Based on the following team documents, please answer this question: "${question}"

Available Documents:
${documentContext}

${context ? `Additional context: ${context}` : ''}

Please provide a helpful answer based on the available information.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});