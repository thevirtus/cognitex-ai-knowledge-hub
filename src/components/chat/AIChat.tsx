import { useState, useRef, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Brain, Send, User as UserIcon, Loader2, Crown, RotateCcw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIMessages } from '@/hooks/useAIMessages';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  user: User;
  teamId: string;
}

export const AIChat = ({ user, teamId }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messagesUsed, canUseAI, isOwner, incrementMessageCount } = useAIMessages();

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (teamId) {
      loadConversationHistory();
    }
  }, [teamId]);

  const loadConversationHistory = async () => {
    try {
      // Get the latest conversation for this user and team
      const { data: conversations, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('team_id', teamId)
        .order('created_at', { ascending: true })
        .limit(50); // Limit to last 50 messages

      if (error) throw error;

      if (conversations && conversations.length > 0) {
        // Group by conversation_id and get the latest conversation
        const conversationGroups = conversations.reduce((acc, msg) => {
          if (!acc[msg.conversation_id]) acc[msg.conversation_id] = [];
          acc[msg.conversation_id].push(msg);
          return acc;
        }, {} as Record<string, any[]>);

        const latestConversationId = Object.keys(conversationGroups)
          .sort((a, b) => {
            const aLatest = Math.max(...conversationGroups[a].map(m => new Date(m.created_at).getTime()));
            const bLatest = Math.max(...conversationGroups[b].map(m => new Date(m.created_at).getTime()));
            return bLatest - aLatest;
          })[0];

        setConversationId(latestConversationId);
        
        const historyMessages: Message[] = conversationGroups[latestConversationId]
          .sort((a, b) => a.message_order - b.message_order)
          .map(msg => ({
            id: msg.id,
            role: msg.message_role as 'user' | 'assistant',
            content: msg.message_content,
            timestamp: new Date(msg.created_at),
          }));

        setMessages(historyMessages);
      } else {
        // No conversation history, start fresh
        setMessages([]);
        
        // Generate new conversation ID
        const newConversationId = crypto.randomUUID();
        setConversationId(newConversationId);
      }
    } catch (error: any) {
      console.error('Error loading conversation history:', error);
      toast({
        title: "Error loading chat history",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startNewConversation = async () => {
    try {
      setMessages([]);
      
      // Generate new conversation ID
      const newConversationId = crypto.randomUUID();
      setConversationId(newConversationId);
      
      toast({
        title: "New conversation started",
        description: "Chat history has been cleared. Starting fresh!",
      });
    } catch (error) {
      console.error('Error starting new conversation:', error);
    }
  };

  const saveMessageToHistory = async (message: Message, messageOrder: number) => {
    try {
      await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          team_id: teamId,
          conversation_id: conversationId,
          message_role: message.role,
          message_content: message.content,
          message_order: messageOrder,
        });
    } catch (error) {
      console.error('Error saving message to history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check AI usage limits based on subscription
    if (!canUseAI) {
      setShowPaywall(true);
      return;
    }

    // Increment message count for non-owners
    if (!isOwner) {
      const canContinue = await incrementMessageCount();
      if (!canContinue) {
        setShowPaywall(true);
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    // Save user message to history
    await saveMessageToHistory(userMessage, newMessages.length);

    try {
      // Get team documents for context
      const { data: documents } = await supabase
        .from('documents')
        .select('id, title, content')
        .eq('team_id', teamId)
        .limit(10);

      // Get integration data for context
      const { data: integrations } = await supabase
        .from('integrations')
        .select('integration_type, config')
        .eq('team_id', teamId)
        .eq('is_active', true);

      // Combine documents and integration data
      const allDocuments = [...(documents || [])];
      
      // Fetch real integration data
      if (integrations) {
        for (const integration of integrations) {
          try {
            if (integration.integration_type === 'google_drive' && integration.config && typeof integration.config === 'object' && 'folder_id' in integration.config) {
              const { data: driveData } = await supabase.functions.invoke('fetch-google-drive', {
                body: { folderId: (integration.config as any).folder_id }
              });
              
              if (driveData && driveData.files) {
                driveData.files.forEach((file: any, index: number) => {
                  allDocuments.push({
                    id: `google-drive-${index}`,
                    title: `Google Drive: ${file.name}`,
                    content: file.content || `File: ${file.name} (${file.mimeType})\nSize: ${file.sizeFormatted}\nLast Modified: ${file.lastModified}`
                  });
                });
              }
            } else {
              // For other integrations, add config info
              allDocuments.push({
                id: `integration-${integration.integration_type}`,
                title: `${integration.integration_type} Integration`,
                content: `Integration Type: ${integration.integration_type}\nConfiguration: ${JSON.stringify(integration.config, null, 2)}`
              });
            }
          } catch (error) {
            console.error(`Error fetching data for ${integration.integration_type}:`, error);
          }
        }
      }

      // Prepare conversation history for AI context (last 10 messages)
      const recentMessages = newMessages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call AI chat function with conversation history
      const { data: aiResponse, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          question: inputMessage,
          documents: allDocuments,
          conversationHistory: recentMessages,
          context: `Team ID: ${teamId}, User: ${user.email}`
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.answer || 'I apologize, but I encountered an error processing your request.',
        timestamp: new Date(),
      };
      
      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);

      // Save AI response to history
      await saveMessageToHistory(aiMessage, finalMessages.length);

    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      
      // Save error message to history
      await saveMessageToHistory(errorMessage, finalMessages.length);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (showPaywall) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Chat - Premium Feature
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-96 text-center space-y-4">
          <Brain className="h-16 w-16 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
            <p className="text-muted-foreground mb-4">
              Get unlimited AI chat access to query your documents, generate insights, and get intelligent answers to your questions.
            </p>
            <Button onClick={() => window.open('/pricing', '_blank')}>
              Upgrade Now
            </Button>
          </div>
          <Button variant="outline" onClick={() => setShowPaywall(false)}>
            Back to Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col max-h-screen">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              AI Chat Assistant
              {isOwner && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 ml-2">
                  <Crown className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={startNewConversation}
                title="Start new conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              {!isOwner && (
                <Badge variant="outline">
                  {messagesUsed} messages used today
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your documents..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isOwner ? 
              "Unlimited AI messages (Owner privileges)" :
              (!canUseAI ? 
                "Daily limit reached. Upgrade for more AI messages." : 
                "AI assistant with conversation memory"
              )
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};