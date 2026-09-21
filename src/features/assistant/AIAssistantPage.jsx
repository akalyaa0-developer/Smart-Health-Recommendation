import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { askWellnessAssistant } from '../../services/aiAssistantService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  User, 
  Bot, 
  PhoneCall, 
  ShieldAlert,
  HelpCircle,
  Clock
} from 'lucide-react';

export function AIAssistantPage() {
  const { userProfile } = useAuth();
  const { recentAssessment } = useWellness();

  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello ${userProfile?.name?.split(' ')[0] || 'there'}! I'm your IntelWell Companion. I can help with whole-food meal ideas, hydration strategies, and natural sleep routines personalized to your ${userProfile?.dietaryPreference || 'wellness'} goals. What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const chatBottomRef = useRef(null);

  const suggestedPrompts = [
    'Suggest high-protein snacks for post-workout recovery.',
    'How can I naturally improve my sleep onset tonight?',
    'What foods help smooth out afternoon energy crashes?',
    'Give me a 15-minute healthy dinner concept.'
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const userContext = {
      name: userProfile?.name,
      dietaryPreference: userProfile?.dietaryPreference,
      wellnessGoals: userProfile?.wellnessGoals,
      allergies: userProfile?.allergies,
      recentSleep: recentAssessment?.sleepHours,
      recentWater: recentAssessment?.waterLiters
    };

    try {
      const response = await askWellnessAssistant(text.trim(), messages, userContext);
      
      if (response.isEmergency) {
        setActiveEmergency(response);
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        isEmergency: response.isEmergency,
        hotlines: response.hotlines,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: "I experienced a brief connection hiccup, but I'm back. Feel free to ask your wellness or nutrition question again!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: `Chat reset. What wellness or nutrition topic can I assist you with today, ${userProfile?.name?.split(' ')[0] || ''}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveEmergency(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              AI Wellness Companion
            </h1>
            <Badge variant="emerald" size="sm" icon={Sparkles}>
              Context-Aware
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated to your {userProfile?.dietaryPreference} dietary profile and recent assessments.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-emerald-900">Safety Guardrails Active:</strong> The IntelWell Companion provides informational lifestyle, hydration, and nutritional guidance. It does not diagnose diseases, prescribe medication, or replace physician care.
        </p>
      </div>

      {/* Main Chat Box */}
      <Card className="p-0 overflow-hidden bg-white border border-slate-200 shadow-md flex flex-col h-[580px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-emerald-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : msg.isEmergency
                        ? 'bg-rose-50 border border-rose-300 text-rose-900 rounded-tl-xs'
                        : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Hotlines if emergency */}
                    {msg.hotlines && (
                      <div className="mt-3 pt-2 border-t border-rose-200 space-y-1.5">
                        <p className="font-bold text-xs text-rose-900">Emergency Hotlines:</p>
                        {msg.hotlines.map(h => (
                          <div key={h.name} className="flex items-center justify-between text-xs">
                            <span className="text-rose-800">{h.name}:</span>
                            <a href={`tel:${h.number}`} className="font-bold underline text-rose-700">
                              {h.number}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`block text-[10px] text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center text-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-slate-100 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
                <span className="ml-1 font-medium">Synthesizing personalized advice...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested:
          </span>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about healthy recipes, sleep hacks, or hydration strategies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              disabled={!input.trim() || loading}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
