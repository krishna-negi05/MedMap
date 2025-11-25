'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCw, Sparkles, ArrowLeft } from 'lucide-react';
import { callGemini } from '../../lib/gemini';
import { useRouter } from 'next/navigation';

export default function HelpPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am the MedMap Support AI. How can I help you with the platform today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // System Prompt to guide the AI
      const systemContext = `You are the helpful support assistant for MedMap, an MBBS study aid application.
      The app features: Mindmaps (AI generated), Clinical Cases, Skills Simulator, Tools (Flashcards, Pharma interactions, Lab interpreter, Viva voice), and a Syllabus Roadmap.
      Answer questions about navigating the app, using tools, or general study advice. Keep answers concise and helpful.`;
      
      const prompt = `${systemContext}\n\nUser asked: "${input}"`;
      
      // Using your existing Gemini utility
      const responseText = await callGemini(prompt); 
      
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-64px)] p-4 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 mt-4">
        <button onClick={() => router.back()} className="p-2 bg-white border rounded-full hover:bg-slate-50">
            <ArrowLeft size={20} className="text-slate-600"/>
        </button>
        <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Help Center <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full uppercase tracking-wider">AI</span>
            </h1>
            <p className="text-slate-500 text-sm">Ask anything about MedMap features.</p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {m.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' : 'bg-slate-900 text-white rounded-tr-none shadow-md'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white animate-pulse">
                    <Sparkles size={16}/>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative flex items-center gap-2">
            <input 
                type="text" 
                className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-xl pl-4 pr-12 py-3 outline-none transition-all" 
                placeholder="How do I save a case?" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
            />
            <button 
                onClick={handleSend} 
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors"
            >
                {loading ? <RefreshCw size={18} className="animate-spin"/> : <Send size={18}/>}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            AI responses may vary. Check standard medical guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}