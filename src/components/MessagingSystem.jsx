import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  User,
  Users,
  Circle,
  Paperclip,
  Image,
  File,
  Phone,
  Video,
  MoreVertical,
  X,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Archive,
  Trash2,
  Star,
  Filter
} from 'lucide-react';

const MessagingSystem = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data - En producción vendría de la base de datos
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        type: 'individual',
        name: 'Dr. Carlos Méndez',
        role: 'Cirujano',
        avatar: 'CM',
        status: 'online',
        lastMessage: '¿Revisaste los resultados del laboratorio?',
        lastMessageTime: '2025-11-20T14:30:00',
        unreadCount: 2,
        pinned: true
      },
      {
        id: 2,
        type: 'individual',
        name: 'Enf. María López',
        role: 'Enfermera - Piso 3',
        avatar: 'ML',
        status: 'online',
        lastMessage: 'El paciente en cama 305 necesita medicación',
        lastMessageTime: '2025-11-20T14:15:00',
        unreadCount: 1,
        pinned: false
      },
      {
        id: 3,
        type: 'group',
        name: 'Equipo de Urgencias',
        role: '12 miembros',
        avatar: 'EU',
        status: 'active',
        lastMessage: 'Dra. Ana: Nuevo paciente crítico en camino',
        lastMessageTime: '2025-11-20T13:45:00',
        unreadCount: 5,
        pinned: true
      },
      {
        id: 4,
        type: 'individual',
        name: 'Paciente: Roberto Sánchez',
        role: 'Paciente',
        avatar: 'RS',
        status: 'offline',
        lastMessage: 'Gracias doctor, me siento mucho mejor',
        lastMessageTime: '2025-11-20T12:00:00',
        unreadCount: 0,
        pinned: false
      },
      {
        id: 5,
        type: 'group',
        name: 'Médicos - Piso 2',
        role: '8 miembros',
        avatar: 'P2',
        status: 'active',
        lastMessage: 'Dr. Luis: Reunión en 30 minutos',
        lastMessageTime: '2025-11-20T11:30:00',
        unreadCount: 0,
        pinned: false
      },
      {
        id: 6,
        type: 'individual',
        name: 'Dra. Patricia Ruiz',
        role: 'Ortopedista',
        avatar: 'PR',
        status: 'away',
        lastMessage: 'Perfecto, nos vemos en el quirófano',
        lastMessageTime: '2025-11-20T10:15:00',
        unreadCount: 0,
        pinned: false
      },
      {
        id: 7,
        type: 'individual',
        name: 'Admin: Laura Martínez',
        role: 'Administración',
        avatar: 'LM',
        status: 'online',
        lastMessage: 'Documentos enviados',
        lastMessageTime: '2025-11-20T09:00:00',
        unreadCount: 0,
        pinned: false
      },
      {
        id: 8,
        type: 'group',
        name: 'Coordinación Quirófanos',
        role: '15 miembros',
        avatar: 'CQ',
        status: 'active',
        lastMessage: 'Sala 2 disponible a las 16:00',
        lastMessageTime: '2025-11-20T08:30:00',
        unreadCount: 0,
        pinned: false
      }
    ];

    const mockMessages = {
      1: [
        {
          id: 1,
          senderId: 1,
          senderName: 'Dr. Carlos Méndez',
          text: 'Buenos días, ¿ya revisaste los resultados del laboratorio del paciente González?',
          timestamp: '2025-11-20T09:00:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 2,
          senderId: 'me',
          senderName: 'Yo',
          text: 'Sí, acabo de revisarlos. Los valores están dentro del rango normal.',
          timestamp: '2025-11-20T09:05:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 3,
          senderId: 1,
          senderName: 'Dr. Carlos Méndez',
          text: 'Excelente. ¿Procedemos con la cirugía programada para mañana?',
          timestamp: '2025-11-20T09:10:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 4,
          senderId: 'me',
          senderName: 'Yo',
          text: 'Sí, todo está en orden. Ya confirmé con anestesiología.',
          timestamp: '2025-11-20T09:15:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 5,
          senderId: 1,
          senderName: 'Dr. Carlos Méndez',
          text: 'Perfecto. Adjunto el plan quirúrgico actualizado.',
          timestamp: '2025-11-20T14:25:00',
          status: 'read',
          type: 'file',
          fileName: 'plan_quirurgico_gonzalez.pdf',
          fileSize: '2.3 MB'
        },
        {
          id: 6,
          senderId: 1,
          senderName: 'Dr. Carlos Méndez',
          text: '¿Revisaste los resultados del laboratorio?',
          timestamp: '2025-11-20T14:30:00',
          status: 'delivered',
          type: 'text'
        }
      ],
      2: [
        {
          id: 1,
          senderId: 2,
          senderName: 'Enf. María López',
          text: 'Doctor, el paciente en cama 305 está reportando dolor intenso.',
          timestamp: '2025-11-20T14:10:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 2,
          senderId: 2,
          senderName: 'Enf. María López',
          text: 'Necesita medicación para el dolor lo antes posible.',
          timestamp: '2025-11-20T14:15:00',
          status: 'delivered',
          type: 'text'
        }
      ],
      3: [
        {
          id: 1,
          senderId: 10,
          senderName: 'Dr. Eduardo Vargas',
          text: 'Equipo, tenemos un caso complicado entrando.',
          timestamp: '2025-11-20T13:30:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 2,
          senderId: 11,
          senderName: 'Enf. Carmen García',
          text: 'Preparando sala de trauma. ¿Cuál es el ETA?',
          timestamp: '2025-11-20T13:35:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 3,
          senderId: 10,
          senderName: 'Dr. Eduardo Vargas',
          text: 'Aproximadamente 10 minutos. Accidente automovilístico, paciente politraumatizado.',
          timestamp: '2025-11-20T13:38:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 4,
          senderId: 12,
          senderName: 'Dra. Ana Torres',
          text: 'Anestesiología lista. Equipos preparados.',
          timestamp: '2025-11-20T13:40:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 5,
          senderId: 12,
          senderName: 'Dra. Ana Torres',
          text: 'Nuevo paciente crítico en camino. Prioridad máxima.',
          timestamp: '2025-11-20T13:45:00',
          status: 'delivered',
          type: 'text'
        }
      ]
    };

    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
      setMessages(mockMessages[mockConversations[0].id] || []);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'unread' && conv.unreadCount > 0) ||
                         (filterStatus === 'pinned' && conv.pinned);
    return matchesSearch && matchesFilter;
  });

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    // Mock messages for selected conversation
    const conversationMessages = {
      1: messages,
      2: [
        {
          id: 1,
          senderId: 2,
          senderName: 'Enf. María López',
          text: 'Doctor, el paciente en cama 305 está reportando dolor intenso.',
          timestamp: '2025-11-20T14:10:00',
          status: 'read',
          type: 'text'
        },
        {
          id: 2,
          senderId: 2,
          senderName: 'Enf. María López',
          text: 'Necesita medicación para el dolor lo antes posible.',
          timestamp: '2025-11-20T14:15:00',
          status: 'delivered',
          type: 'text'
        }
      ]
    };
    setMessages(conversationMessages[conversation.id] || []);
    
    // Mark as read
    setConversations(conversations.map(c =>
      c.id === conversation.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 'me',
      senderName: 'Yo',
      text: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Update last message in conversation
    setConversations(conversations.map(c =>
      c.id === selectedConversation.id
        ? { ...c, lastMessage: newMessage, lastMessageTime: newMsg.timestamp }
        : c
    ));

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);
  };

  const getStatusColor = (status) => {
    const colors = {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      offline: 'bg-gray-400',
      active: 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-400';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return <Clock size={14} className="text-gray-400" />;
    }
  };

  // Stats
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const onlineContacts = conversations.filter(c => c.status === 'online').length;
  const activeGroups = conversations.filter(c => c.type === 'group' && c.status === 'active').length;

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 p-6 animate-fadeIn">
      {/* Sidebar - Conversations List */}
      <div className="w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              <MessageSquare size={28} />
              Mensajes
            </h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
              title="Nuevo chat"
            >
              <MessageSquare size={20} className="text-purple-600" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-2 text-white text-center">
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-xs">No leídos</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 text-white text-center">
              <p className="text-2xl font-bold">{onlineContacts}</p>
              <p className="text-xs">En línea</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 text-white text-center">
              <p className="text-2xl font-bold">{activeGroups}</p>
              <p className="text-xs">Grupos</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('unread')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'unread'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              No leídos
            </button>
            <button
              onClick={() => setFilterStatus('pinned')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === 'pinned'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Fijados
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                selectedConversation?.id === conversation.id
                  ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-l-purple-600'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {conversation.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(conversation.status)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">{conversation.name}</p>
                      {conversation.pinned && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
                    </div>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{conversation.role}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {selectedConversation.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(selectedConversation.status)}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.type === 'group' 
                      ? selectedConversation.role 
                      : selectedConversation.status === 'online' ? 'En línea' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Llamada de voz">
                  <Phone size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Videollamada">
                  <Video size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Más opciones">
                  <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => {
                const isMe = message.senderId === 'me';
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slideIn`}
                  >
                    <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                      {!isMe && selectedConversation.type === 'group' && (
                        <p className="text-xs text-gray-500 mb-1 ml-3">{message.senderName}</p>
                      )}
                      <div
                        className={`rounded-2xl p-4 ${
                          isMe
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {message.type === 'text' && (
                          <p className="text-sm">{message.text}</p>
                        )}
                        {message.type === 'file' && (
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${isMe ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                              <File size={24} className={isMe ? 'text-white' : 'text-purple-600'} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{message.fileName}</p>
                              <p className={`text-xs ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                                {message.fileSize}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className={`flex items-center gap-2 mt-2 text-xs ${isMe ? 'text-white/70 justify-end' : 'text-gray-500'}`}>
                          <span>{formatMessageTime(message.timestamp)}</span>
                          {isMe && getMessageStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Adjuntar archivo"
                  >
                    <Paperclip size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Adjuntar imagen"
                  >
                    <Image size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Escribe un mensaje..."
                  rows="1"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 resize-none"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecciona una conversación</p>
              <p className="text-sm">Elige un contacto o grupo para comenzar a chatear</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={24} />
                Nuevo Chat
              </h2>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar contacto..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Mock contact list */}
                {['Dr. Alberto Soto', 'Enf. Rosa García', 'Dra. Isabel Moreno', 'Admin: Juan Pérez'].map((name, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    onClick={() => setShowNewChatModal(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{name}</p>
                      <p className="text-xs text-gray-500">Disponible</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingSystem;
