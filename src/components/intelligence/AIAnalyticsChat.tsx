import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Bot, User, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { maritimeAIService, AIAnalysisResponse } from "@/services/maritimeAIService";
import { useToast } from "@/components/ui/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  analysisType?: string;
  isLoading?: boolean;
}

const AIAnalyticsChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to ArgoSight AI Intelligence. I can help you analyze maritime threats, identify patterns, generate reports, and answer questions about vessel activities. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollAreaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: 'Analyzing maritime intelligence data...',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await maritimeAIService.queryNaturalLanguage(inputValue);
      
      setMessages(prev => prev.slice(0, -1).concat([{
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: response.analysis,
        timestamp: new Date(),
        analysisType: response.analysisType
      }]));

    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => prev.slice(0, -1).concat([{
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please ensure the OpenAI API key is configured and try again.',
        timestamp: new Date()
      }]));
      
      toast({
        title: "AI Analysis Error",
        description: "Failed to get AI response. Check API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQueries = [
    "Show me potential ghost vessels in the last 24 hours",
    "Analyze Arctic shipping route efficiency",
    "What are the current maritime security threats?",
    "Generate a daily intelligence report",
    "Identify vessels with suspicious movement patterns"
  ];

  const handleQuickQuery = (query: string) => {
    setInputValue(query);
  };

  return (
    <Card className="h-[600px] flex flex-col bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          <span>AI Maritime Intelligence</span>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            LIVE ANALYSIS
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Quick Query Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuery(query)}
              className="text-xs text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              {query.length > 30 ? `${query.substring(0, 30)}...` : query}
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                    {message.isLoading ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.analysisType && (
                      <Badge variant="outline" className="text-xs">
                        {message.analysisType.replace('_', ' ').toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollAreaRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about maritime intelligence, threats, patterns, or generate reports..."
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Analysis Status */}
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>AI Analysis Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Real-time Threat Detection</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Pattern Recognition</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAnalyticsChat;