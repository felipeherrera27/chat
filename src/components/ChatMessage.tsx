import React from 'react';
import { Message } from '../types';
import { QuickOptions } from './QuickOptions';

interface ChatMessageProps {
  message: Message;
  onOptionSelect: (value: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionSelect }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {isBot && message.options && (
          <QuickOptions options={message.options} onSelect={onOptionSelect} />
        )}
        <span className="text-xs opacity-70 mt-2 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};