import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'bot' | 'user';
};

const FAQ_RULES = [
  {
    keywords: ['hours', 'open', 'close', 'time', 'when'],
    answer: 'Our regular business hours are Monday through Friday, 9:00 AM to 5:00 PM. We are typically closed on weekends.'
  },
  {
    keywords: ['location', 'where', 'address', 'find', 'directions', 'located'],
    answer: 'We are conveniently located at 123 Smile Avenue. You can find our full contact details in the footer of our website.'
  },
  {
    keywords: ['book', 'appointment', 'schedule', 'reserve', 'free session', 'consultation', 'consult'],
    answer: 'You can easily book a free consultation or appointment by clicking the "Book Appointment" button at the top of the page, or by clicking "Book Online".'
  },
  {
    keywords: ['insurance', 'accept', 'pay', 'cost', 'price', 'medicaid', 'pricing', 'how much', 'fee'],
    answer: 'Our pricing varies depending on the treatment. We accept most major PPO dental insurance plans, and our team will verify your benefits before your appointment to minimize out-of-pocket costs. Contact us for a precise quote.'
  },
  {
    keywords: ['emergency', 'pain', 'broken', 'urgent', 'hurt'],
    answer: 'We reserve time for dental emergencies daily. If you are experiencing severe pain, swelling, or a broken tooth, please call us directly or book an urgent appointment.'
  },
  {
    keywords: ['services', 'treatments', 'offer', 'do you', 'programs', 'program', 'procedure'],
    answer: 'We offer a wide range of programs and services including cleanings, whitening, fillings, crowns, orthodontics, and emergency care. Please check our home page for details.'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon'],
    answer: 'Hello! Welcome to Riad\'s Dental Care. How can I help you today? You can ask about our pricing, hours, location, programs, or booking a free session.'
  },
  {
    keywords: ['thank', 'thanks', 'cool', 'awesome', 'great'],
    answer: 'You\'re welcome! Let me know if you need anything else.'
  }
];

const DEFAULT_ANSWER = "I'm not quite sure about that. Could you try asking about our pricing, hours, location, programs, or how to book a free session?";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there! I'm Rita's virtual assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const newUserMsg: Message = { id: Date.now(), text: userText, sender: 'user' };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');

    // Process answer
    setTimeout(() => {
      let botAnswer = DEFAULT_ANSWER;
      const lowerInput = userText.toLowerCase();

      for (const rule of FAQ_RULES) {
        if (rule.keywords.some(kw => lowerInput.includes(kw))) {
          botAnswer = rule.answer;
          break;
        }
      }

      setMessages(prev => [...prev, { id: Date.now(), text: botAnswer, sender: 'bot' }]);
    }, 600);
  };

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-full shadow-lg shadow-teal-500/40 hover:shadow-xl hover:shadow-teal-500/60 transition-all duration-300 z-50 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-teal-500/30 animate-bounce group"
          aria-label="Open virtual assistant chatbot"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-7 h-7 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-2 text-yellow-300 animate-pulse" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-100 overflow-hidden text-sm sm:text-base h-[500px] max-h-[80vh] flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-teal-600 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-medium">Virtual Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-teal-100 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-teal-100 text-teal-600'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div 
                    className={`p-3 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-teal-600 text-white rounded-br-none shadow-sm' 
                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 transition-colors flex-shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
