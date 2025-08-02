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
    const { question, documents, conversationHistory, context } = await req.json();

    if (!question) {
      throw new Error("Question is required");
    }

    if (!openAIApiKey) {
      console.log("OPENAI_API_KEY not configured");
      return new Response(JSON.stringify({ 
        answer: "I'm sorry, but the AI service is not configured yet. Please contact your administrator to set up the OpenAI API key." 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare context from documents
    const documentContext = documents?.map((doc: any, index: number) => 
      `Document ${index + 1} - ${doc.title}:\n${doc.content?.substring(0, 1000)}...`
    ).join('\n\n') || '';

    const systemPrompt = `You are Cognitex AI, an intelligent assistant that helps teams find information from their knowledge base. 

You have access to the team's documents and conversation history. Provide helpful, accurate answers based on the available information and maintain context from previous messages.

If you can't find relevant information in the provided documents, say so clearly. Remember previous parts of the conversation to provide coherent responses.

Always be concise but thorough, and reference which documents you're drawing information from when possible.`;

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history if available
    if (conversationHistory && conversationHistory.length > 0) {
      // Add previous messages for context
      conversationHistory.slice(-8).forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Add the current question with document context
    const userPrompt = `Based on the following team documents and our conversation history, please answer this question: "${question}"

Available Documents:
${documentContext}

${context ? `Additional context: ${context}` : ''}

Please provide a helpful answer based on the available information and our previous conversation.`;

    messages.push({ role: 'user', content: userPrompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
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