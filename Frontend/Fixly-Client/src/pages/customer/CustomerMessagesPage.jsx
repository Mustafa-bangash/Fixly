import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/routes.js';

export default function CustomerMessagesPage() {
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [replyText, setReplyText] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 1,
      providerName: 'Usman Tariq',
      service: 'AC Repair & Cooling',
      rating: '4.8',
      verified: true,
      lastMessage: 'I can arrive tomorrow at 10:00 AM. Please keep the unit turned off.',
      time: '12m ago',
      messages: [
        { sender: 'provider', text: 'Salam Ahmed sahib, I saw your AC cooling request.', time: '10:15 AM' },
        { sender: 'customer', text: 'Walaikum Assalam. Yes, the cooling is very low and gas might be leaking.', time: '10:18 AM' },
        { sender: 'provider', text: 'I can arrive tomorrow at 10:00 AM. Please keep the unit turned off.', time: '10:20 AM' },
      ],
    },
    {
      id: 2,
      providerName: 'Bilal Ahmed',
      service: 'Washing Machine Repair',
      rating: '4.6',
      verified: true,
      lastMessage: 'I need to check the drum belt before giving the final estimate.',
      time: '1h ago',
      messages: [
        { sender: 'provider', text: 'Hello! I specialize in automatic washing machine repairs.', time: '9:00 AM' },
        { sender: 'customer', text: 'The drum makes a loud noise during spinning cycle.', time: '9:05 AM' },
        { sender: 'provider', text: 'I need to check the drum belt before giving the final estimate.', time: '9:10 AM' },
      ],
    },
  ]);

  const activeConvo = conversations[activeChatIndex];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const updated = [...conversations];
    updated[activeChatIndex].messages.push({
      sender: 'customer',
      text: replyText.trim(),
      time: 'Just now',
    });
    updated[activeChatIndex].lastMessage = replyText.trim();
    setConversations(updated);
    setReplyText('');
  };

  return (
    <div className="mx-auto max-w-[1000px] space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy">Messages & Chat</h1>
        <p className="mt-1 text-sm text-muted">Direct communication with your selected service providers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] rounded-xl border border-line bg-white shadow-2xs overflow-hidden min-h-[520px]">
        
        {/* Left: Provider Chat List */}
        <div className="border-r border-line bg-page/40">
          <div className="p-3.5 border-b border-line bg-white">
            <h2 className="text-xs font-bold text-navy uppercase tracking-wider">Conversations</h2>
          </div>
          <div className="divide-y divide-line overflow-y-auto">
            {conversations.map((convo, idx) => (
              <button
                key={convo.id}
                type="button"
                onClick={() => setActiveChatIndex(idx)}
                className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                  activeChatIndex === idx ? 'bg-brand-light/60 border-l-4 border-brand' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-sm font-bold text-white shrink-0">
                  {convo.providerName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-navy truncate">{convo.providerName}</span>
                    <span className="text-[11px] text-muted">{convo.time}</span>
                  </div>
                  <p className="text-xs text-brand font-medium truncate">{convo.service}</p>
                  <p className="mt-1 text-xs text-muted truncate">{convo.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        <div className="flex flex-col h-full bg-white">
          
          {/* Header of Active Chat */}
          <div className="p-4 border-b border-line flex items-center justify-between bg-page/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {activeConvo.providerName.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                  {activeConvo.providerName}
                  <span className="text-xs text-green-700 font-semibold bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                    ✓ Verified
                  </span>
                </h3>
                <p className="text-xs text-muted">{activeConvo.service} · ★ {activeConvo.rating}</p>
              </div>
            </div>
            <Link
              to={ROUTES.requests}
              className="text-xs font-semibold text-brand hover:underline"
            >
              View Request
            </Link>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-page/10">
            {activeConvo.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === 'customer' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === 'customer'
                      ? 'bg-brand text-white rounded-br-xs'
                      : 'bg-white border border-line text-ink rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[10px] text-muted px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-line flex gap-2 bg-white">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-brand"
            />
            <button
              type="submit"
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1648a0] transition-colors cursor-pointer"
            >
              Send
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
