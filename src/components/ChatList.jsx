import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase-client'; // Or your custom supabase client import
import { useAuth } from "../context/AuthContext";



export default function ChatList({ currentUserId }) {
  const [activeChatId, setActiveChatId] = useState(null); // This is your chattingWithId
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChats, setActiveChats] = useState([]); // Array of users you have chats with
  const { signInWithGitHub, signOut, user } = useAuth();

  // 1. FETCH CONVERSATION HISTORY WHEN ACTIVE CHAT CHANGES
  useEffect(() => {
    if (!activeChatId || !currentUserId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${activeChatId}),and(sender_id.eq.${activeChatId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // 2. LISTEN FOR LIVE MESSAGES (REALTIME)
    const channel = supabase
      .channel(`room-${activeChatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new;
          // Check if message belongs to this specific 2-person conversation
          if (
            (msg.sender_id === currentUserId && msg.receiver_id === activeChatId) ||
            (msg.sender_id === activeChatId && msg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChatId, currentUserId]);

  // 3. SEND MESSAGE HANDLER
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId || !currentUserId) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Clear input immediately for snappy UI

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUserId,   
        receiver_id: activeChatId, // activeChatId acts as chattingWithId
        content: messageToSend
      });

    if (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <div className='max-w-5xl mx-auto h-[85vh] flex text-white font-sans'>
      
      {/* LEFT SIDEBAR: Chat List */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col h-full ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="border border-white/10 p-4 rounded-xl mb-4 bg-black/10">
          <div className='flex flex-col w-full gap-2'>
            <div className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              Search for a user to add
            </div>
            <input 
              type="text" 
              placeholder="Type user ID..."
              className='w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-white/30 transition'
            />
          </div>
        </div>

        {/* Dynamic Chat List Mapping */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {activeChats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`border border-white/10 p-4 rounded-xl cursor-pointer flex items-center gap-4 bg-black/5 ${activeChatId === chat.id ? 'bg-white/5 border-white/30' : ''}`}
            >
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-bold text-sm bg-white/5">
                U
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate text-gray-200">{chat.username || chat.id}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN WINDOW: Message Container */}
      <div className={`flex-1 flex flex-col h-full border border-white/10 rounded-xl bg-black/5 overflow-hidden ml-0 md:ml-4 ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChatId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
              <button onClick={() => setActiveChatId(null)} className="md:hidden p-1 mr-1 rounded hover:bg-white/10">
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              </button>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center font-bold text-xs bg-white/5">U</div>
              <div>
                <h2 className="font-semibold text-sm">User {activeChatId.slice(0,4)}...</h2>
              </div>
            </div>

            {/* Live Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] border px-4 py-2 text-sm rounded-2xl ${
                      isMe 
                        ? 'border-emerald-500/20 bg-emerald-500/10 rounded-tr-none' 
                        : 'border-white/10 bg-white/5 rounded-tl-none'
                    }`}>
                      <p className="text-white">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Form Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2 bg-white/5">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/30"
              />
              <button type="submit" className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/10 transition">
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-500">
            <p className="text-sm">Select a user from the list to start chatting</p>
          </div>
        )}
      </div>

    </div>
  );
}
