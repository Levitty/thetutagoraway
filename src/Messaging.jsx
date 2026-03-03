import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

// Format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) return date.toLocaleDateString('en', { weekday: 'short' });
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
};

// Avatar Component
const Avatar = ({ src, name, size = 40, online = false }) => (
  <div className="relative">
    <img 
      src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=10b981&color=fff`} 
      alt={name} 
      className="rounded-full object-cover bg-slate-200" 
      style={{ width: size, height: size }} 
    />
    {online && (
      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
    )}
  </div>
);

// Message Bubble
const MessageBubble = ({ message, isOwn, showAvatar, senderName, senderAvatar }) => (
  <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
    {showAvatar ? (
      <Avatar src={senderAvatar} name={senderName} size={32} />
    ) : (
      <div className="w-8" />
    )}
    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`px-4 py-2 rounded-2xl ${
        isOwn 
          ? 'bg-emerald-500 text-white rounded-br-md' 
          : 'bg-slate-100 text-slate-900 rounded-bl-md'
      }`}>
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
      </div>
      <p className={`text-xs text-slate-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
        {formatTime(message.created_at)}
      </p>
    </div>
  </div>
);

// Conversation List Item
const ConversationItem = ({ conversation, isActive, onClick, currentUserId }) => {
  const otherPerson = conversation.participant1?.id === currentUserId 
    ? conversation.participant2 
    : conversation.participant1;
  
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
        isActive ? 'bg-emerald-50 border-l-2 border-emerald-500' : ''
      }`}
    >
      <Avatar 
        src={otherPerson?.avatar_url} 
        name={otherPerson?.full_name} 
        size={48}
        online={conversation.online}
      />
      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-center">
          <span className="font-medium text-slate-900 truncate">{otherPerson?.full_name || 'Unknown'}</span>
          <span className="text-xs text-slate-400">{formatTime(conversation.last_message_at)}</span>
        </div>
        <p className="text-sm text-slate-500 truncate">{conversation.last_message || 'No messages yet'}</p>
      </div>
      {conversation.unread_count > 0 && (
        <span className="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
          {conversation.unread_count}
        </span>
      )}
    </button>
  );
};

// Lottie component for animations
const Lottie = ({ src, width = 120, height = 120, loop = true }) => {
  React.useEffect(() => {
    if (!document.querySelector('script[src*="lottie-player"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <lottie-player
      src={src}
      background="transparent"
      speed="1"
      style={{ width, height }}
      loop={loop}
      autoplay
    />
  );
};

// Animation URLs
const CHAT_ANIMATIONS = {
  empty: 'https://assets1.lottiefiles.com/packages/lf20_wnqlfojb.json',
  chat: 'https://assets5.lottiefiles.com/packages/lf20_zjsua8rb.json',
};

// Empty State
const EmptyState = ({ type = 'empty', title, description }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
    <Lottie src={CHAT_ANIMATIONS[type] || CHAT_ANIMATIONS.empty} width={120} height={120} />
    <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
);

// Main Messaging Component
export const Messaging = ({ currentUser, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    if (!currentUser?.id) return;
    
    const fetchConversations = async () => {
      setLoading(true);
      
      // Get all messages where user is sender or receiver
      const { data: messageData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
        return;
      }

      // Group by conversation partner
      const conversationMap = new Map();
      
      messageData?.forEach(msg => {
        const partnerId = msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id;
        const partner = msg.sender_id === currentUser.id ? msg.receiver : msg.sender;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            participant1: currentUser,
            participant2: partner,
            last_message: msg.content,
            last_message_at: msg.created_at,
            unread_count: (!msg.read && msg.receiver_id === currentUser.id) ? 1 : 0,
          });
        } else {
          const conv = conversationMap.get(partnerId);
          if (!msg.read && msg.receiver_id === currentUser.id) {
            conv.unread_count++;
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id}`,
      }, (payload) => {
        // Refresh conversations when new message arrives
        fetchConversations();
        
        // If this message is for the active conversation, add it
        if (activeConversation && 
            (payload.new.sender_id === activeConversation.participant2?.id)) {
          setMessages(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser?.id]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversation?.participant2?.id || !currentUser?.id) return;

    const fetchMessages = async () => {
      const partnerId = activeConversation.participant2.id;
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
        
        // Mark messages as read
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('sender_id', partnerId)
          .eq('receiver_id', currentUser.id)
          .eq('read', false);
      }
    };

    fetchMessages();
    inputRef.current?.focus();
  }, [activeConversation, currentUser?.id]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversation?.participant2?.id || sending) return;

    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage('');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: activeConversation.participant2.id,
        content: messageContent,
      })
      .select()
      .single();

    if (data) {
      setMessages(prev => [...prev, data]);
      
      // Update conversation list
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === activeConversation.id) {
            return { ...conv, last_message: messageContent, last_message_at: new Date().toISOString() };
          }
          return conv;
        });
        return updated.sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at));
      });
    }

    setSending(false);
    inputRef.current?.focus();
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => 
    conv.participant2?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden shadow-2xl">
        {/* Sidebar - Conversations List */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900">Messages</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <EmptyState 
                type="chat"
                title="No conversations" 
                description="Start a conversation by booking a lesson"
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredConversations.map(conv => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => setActiveConversation(conv)}
                    currentUserId={currentUser.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main - Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 px-4 flex items-center gap-3 bg-white border-b border-slate-200">
                <button 
                  onClick={() => setActiveConversation(null)}
                  className="lg:hidden text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <Avatar 
                  src={activeConversation.participant2?.avatar_url} 
                  name={activeConversation.participant2?.full_name} 
                  size={40}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{activeConversation.participant2?.full_name}</h3>
                  <p className="text-xs text-slate-500">Click to view profile</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👋</div>
                      <p className="text-slate-500">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => {
                      const isOwn = msg.sender_id === currentUser.id;
                      const showAvatar = index === 0 || 
                        messages[index - 1]?.sender_id !== msg.sender_id ||
                        (new Date(msg.created_at) - new Date(messages[index - 1]?.created_at)) > 300000;
                      
                      return (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isOwn={isOwn}
                          showAvatar={showAvatar}
                          senderName={isOwn ? currentUser.full_name : activeConversation.participant2?.full_name}
                          senderAvatar={isOwn ? currentUser.avatar_url : activeConversation.participant2?.avatar_url}
                        />
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState 
              type="chat"
              title="Select a conversation" 
              description="Choose a conversation from the list to start messaging"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Message Button Component (for dashboards)
export const MessageButton = ({ onClick, unreadCount = 0 }) => (
  <button
    onClick={onClick}
    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
  >
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </button>
);

// Start Conversation Helper (to initiate chat with a tutor)
export const startConversation = async (senderId, receiverId, initialMessage) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: initialMessage || 'Hi! I would like to connect with you.',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, message: data };
  } catch (err) {
    console.error('Error starting conversation:', err);
    return { success: false, error: err.message };
  }
};

export default Messaging;
