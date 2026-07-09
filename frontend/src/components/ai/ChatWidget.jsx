import { useState, useRef, useEffect } from 'react'
import api from '../../utils/api'
import { X, Send, Bot, User, Minus, Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  '🚧 Show current blockers',
  '📊 Team summary',
  "⏳ Who hasn't submitted?",
  '📁 Reports by project',
  '🏆 Most active member',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m your AI team assistant 🤖\nAsk me about reports, blockers, or team activity.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [open, messages])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const { data } = await api.post('/ai/chat', { message: msg })
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
      if (!open) setUnread(u => u + 1)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const renderText = (text) =>
    text.split('\n').map((line, i) => {
      const html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <p key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
    })

  return (
    <>
      <style>{`
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes bounceBot {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .chat-enter { animation: slideUpChat 0.3s ease both; }
        .pulse-ring { animation: pulseRing 1.8s ease-out infinite; }
        .bot-bounce { animation: bounceBot 2s ease-in-out infinite; }
        .typing-dot { animation: bounceBot 1s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.30s; }
      `}</style>

      {/* Chat Window */}
      {open && !minimized && (
        <div className="chat-enter fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden"
          style={{ width: 360, height: 520, borderRadius: 24, boxShadow: '0 20px 60px rgba(124,58,237,0.25), 0 4px 20px rgba(0,0,0,0.15)' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' }}>
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center bot-bounce">
                <Bot size={18} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-violet-700" />
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-sm flex items-center gap-1.5">
                AI Team Assistant
                <Sparkles size={12} className="text-yellow-300" />
              </p>
              <p className="text-violet-200 text-xs">Powered by TechWare AI</p>
            </div>
            <button onClick={() => setMinimized(true)}
              className="p-1.5 hover:bg-white/15 rounded-lg transition-colors">
              <Minus size={14} className="text-white" />
            </button>
            <button onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/15 rounded-lg transition-colors">
              <X size={14} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: '#faf8ff' }}>

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'user'
                    ? 'bg-violet-100'
                    : 'bg-violet-600'
                }`}>
                  {msg.role === 'user'
                    ? <User size={13} className="text-violet-600" />
                    : <Bot size={13} className="text-white" />}
                </div>
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs space-y-0.5 ${
                  msg.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'text-gray-700 rounded-tl-sm'
                }`}
                  style={msg.role === 'user'
                    ? { background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }
                    : { background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid rgba(139,92,246,0.12)' }}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                  style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full typing-dot"
                      style={{ background: '#7c3aed', animationDelay: `${i*0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 flex flex-wrap gap-1.5 flex-shrink-0"
              style={{ background: '#faf8ff', borderTop: '1px solid rgba(139,92,246,0.10)' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.15)' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 flex gap-2 flex-shrink-0"
            style={{ background: 'white', borderTop: '1px solid rgba(139,92,246,0.10)' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask about your team..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400"
              style={{ background: '#f5f0ff', border: '1px solid rgba(139,92,246,0.15)', color: '#1f2937' }} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 2px 8px rgba(124,58,237,0.35)' }}>
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Minimized bar */}
      {open && minimized && (
        <div className="chat-enter fixed bottom-24 right-6 z-50 flex items-center gap-3 px-4 py-3 cursor-pointer rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
          onClick={() => setMinimized(false)}>
          <Bot size={16} className="text-white" />
          <span className="text-white text-sm font-bold">AI Assistant</span>
          <span className="text-violet-200 text-xs">Click to expand</span>
        </div>
      )}

      {/* Toggle FAB */}
      <button onClick={() => { setOpen(!open); setMinimized(false) }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all hover:scale-110"
        style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 8px 24px rgba(124,58,237,0.45)' }}>

        {/* Pulse ring when closed */}
        {!open && (
          <span className="pulse-ring absolute inset-0 rounded-[18px]"
            style={{ border: '2px solid rgba(124,58,237,0.5)' }} />
        )}

        {open
          ? <X size={22} className="text-white" />
          : <Bot size={22} className="text-white" />}

        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-black flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </>
  )
}
