import { useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { QuickReplies } from './QuickReplies';
import { ChatInput } from './ChatInput';
import { Message } from '../../types/types';

interface ChatWindowProps {
  isMinimized: boolean;
  isConnected: boolean;
  messages: Message[];
  isTyping: boolean;
  showQuickReplies: boolean;
  inputText: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onMinimize: () => void;
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatWindow = ({
  isMinimized,
  isConnected,
  messages,
  isTyping,
  showQuickReplies,
  inputText,
  messagesEndRef,
  onMinimize,
  onClose,
  onInputChange,
  onSendMessage,
  onKeyDown,
  onSuggestionClick
}: ChatWindowProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={popupRef}
      className={`fixed bottom-20 right-4 z-50 w-80 sm:w-96 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-96 sm:h-[500px]'
      }`}
    >
      {/* Header */}
      <ChatHeader
        isConnected={isConnected}
        isMinimized={isMinimized}
        onMinimize={onMinimize}
        onClose={onClose}
      />

      {/* Messages Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64 sm:h-80 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
            
            {/* Quick Reply Buttons */}
            {showQuickReplies && messages.length === 1 && (
              <QuickReplies onSuggestionClick={onSuggestionClick} />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <ChatInput
            inputText={inputText}
            onInputChange={onInputChange}
            onSendMessage={onSendMessage}
            onKeyDown={onKeyDown}
          />
        </>
      )}
    </div>
  );
};
