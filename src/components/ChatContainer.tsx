import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { getInitialMessage, handleUserInput } from '../utils/chatLogic';
import { MessageCircle } from 'lucide-react';

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState('initial');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial bot message
    const initialMessage: Message = {
      id: '0',
      content: getInitialMessage().text,
      sender: 'bot',
      timestamp: new Date(),
      options: getInitialMessage().options
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Process response
    setTimeout(() => {
      const { response, nextStep } = handleUserInput(content, currentStep);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.text || response,
        sender: 'bot',
        timestamp: new Date(),
        options: response.options
      };
      
      setMessages(prev => [...prev, botMessage]);
      setCurrentStep(nextStep);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Asistente de Reservas</h2>
        </div>
        
        <div className="h-[500px] overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onOptionSelect={handleSendMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <ChatInput onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};