import { useState, useEffect, useRef } from 'react';
import { Message } from '../../types/types';

export const useChatbot = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý AI của MovieTix. Tôi có thể giúp bạn tìm phim, đặt vé hoặc trả lời các câu hỏi về rạp chiếu phim. Bạn cần hỗ trợ gì?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fallback bot responses when API is unavailable
  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('phim sắp chiếu') || input.includes('upcoming') || input.includes('sắp ra mắt')) {
      return 'Hiện tại có nhiều phim sắp chiếu hấp dẫn như Batman, Oppenheimer, và các phim Việt Nam mới. Bạn có thể xem danh sách đầy đủ trong trang "Phim" và chọn tab "Sắp ra mắt".';
    } else if (input.includes('phim') || input.includes('movie')) {
      return 'Bạn có thể tìm kiếm phim trong trang "Phim" hoặc xem lịch chiếu trong trang chủ. Tôi có thể giúp bạn tìm phim theo thể loại, diễn viên hoặc đạo diễn. Bạn muốn tìm phim gì?';
    } else if (input.includes('đặt vé') || input.includes('booking')) {
      return 'Để đặt vé, bạn chọn phim muốn xem, sau đó chọn suất chiếu và ghế ngồi. Hệ thống hỗ trợ thanh toán qua VNPay, Momo và chuyển khoản ngân hàng. Bạn cần hỗ trợ đặt vé cho phim nào?';
    } else if (input.includes('giá') || input.includes('price') || input.includes('tiền')) {
      return 'Giá vé phụ thuộc vào loại ghế và suất chiếu:\n• Ghế thường: 80.000 - 100.000 VNĐ\n• Ghế VIP: 120.000 - 150.000 VNĐ\n• Phụ thu cuối tuần và giờ vàng: +20.000 VNĐ';
    } else if (input.includes('rạp') || input.includes('theater') || input.includes('cinema')) {
      return 'Chúng tôi có nhiều rạp chiếu phim tại các địa điểm khác nhau như CGV, Lotte Cinema, Galaxy Cinema. Bạn có thể xem danh sách rạp và địa chỉ trong trang "Rạp chiếu phim".';
    } else if (input.includes('lịch chiếu') || input.includes('showtime') || input.includes('suất chiếu')) {
      return 'Lịch chiếu được cập nhật hàng ngày. Bạn có thể xem lịch chiếu theo ngày và rạp trong trang chủ hoặc trang chi tiết phim. Bạn muốn xem lịch chiếu ngày nào?';
    } else if (input.includes('xin chào') || input.includes('hello') || input.includes('hi') || input.includes('chào')) {
      return 'Xin chào! Tôi là trợ lý AI của MovieTix. Tôi có thể giúp bạn:\n• Tìm phim và lịch chiếu\n• Hướng dẫn đặt vé\n• Thông tin giá vé và rạp chiếu\n• Phim sắp chiếu\nBạn cần hỗ trợ gì?';
    } else {
      return 'Xin lỗi, tôi không thể kết nối đến hệ thống AI lúc này. Tôi có thể giúp bạn về: tìm phim, đặt vé, thông tin rạp chiếu, giá vé, lịch chiếu. Hoặc bạn có thể thử lại sau!';
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);
    setShowQuickReplies(false);

    try {
      // Call chatbot API
      const response = await fetch('http://localhost:8000/chat-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentInput
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      setIsConnected(true);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.',
        sender: 'bot',
        timestamp: new Date(),
        data: data.data || undefined // Include movie data if available
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      setIsConnected(false);
      
      // Fallback to local response if API fails
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(currentInput),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    // Trigger send after setting input
    setTimeout(() => handleSendMessage(), 100);
  };

  return {
    // State
    open,
    minimized,
    messages,
    inputText,
    isTyping,
    isConnected,
    showQuickReplies,
    messagesEndRef,
    
    // Actions
    setOpen,
    setMinimized,
    setInputText,
    handleSendMessage,
    handleKeyPress,
    handleSuggestionClick
  };
};
