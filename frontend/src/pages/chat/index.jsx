import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { messageApi } from '@/entities/message/api/messageApi';
import { conversationApi } from '@/entities/conversation/api/conversationApi';
import { userApi } from '@/entities/user/api/userApi';
import { createWebSocket, sendWebSocketMessage } from '@/shared/lib/utils/websocket';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { FiArrowLeft, FiSend, FiUsers, FiMessageCircle, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import './Chat.css';

const MESSAGES_PER_PAGE = 50;

export const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const outletCtx = useOutletContext?.() || {};
  const { isChatFullscreen, setIsChatFullscreen } = outletCtx;
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [wsState, setWsState] = useState(null);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const currentUserRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Обновляем ref при изменении currentUser
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'message:new' || data.type === 'message') {
      const message = data.payload || data;
      const currentUserId = currentUserRef.current?.id;
      
      setMessages((prev) => {
        // Проверяем, есть ли уже такое сообщение
        const existingIndex = prev.findIndex((m) => m.id === message.id);
        if (existingIndex !== -1) {
          return prev;
        }
        
        // Если это сообщение от текущего пользователя, заменяем временное сообщение
        if (message.sender_id === currentUserId) {
          // Удаляем все временные сообщения с таким же текстом
          const filtered = prev.filter((m) => !(m.isPending && m.text === message.text && m.sender_id === currentUserId));
          setShouldScrollToBottom(true);
          return [...filtered, message];
        }
        
        // Для сообщений от других пользователей просто добавляем
        setShouldScrollToBottom(true);
        return [...prev, message];
      });
    }
  }, []);

  useEffect(() => {
    loadInitialData();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setWsState(null);
      }
    };
  }, [id]);

  useEffect(() => {
    if (conversation && id && !wsRef.current) {
      const websocket = createWebSocket(id, handleWebSocketMessage, () => {
        // Reconnect logic
        if (id && !wsRef.current) {
          const newWs = createWebSocket(id, handleWebSocketMessage);
          if (newWs) {
            wsRef.current = newWs;
            setWsState(newWs);
          }
        }
      });
      if (websocket) {
        wsRef.current = websocket;
        setWsState(websocket);
      }
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setWsState(null);
      }
    };
  }, [conversation, id, handleWebSocketMessage]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      // Небольшая задержка для корректного скролла после рендера
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [messages, shouldScrollToBottom]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [userData, conversationData] = await Promise.all([
        userApi.getMe(),
        conversationApi.getList().then((chats) =>
          chats.find((c) => c.id === id)
        ),
      ]);

      setCurrentUser(userData);
      setConversation(conversationData);
      await loadMessages(0);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (messageOffset) => {
    try {
      const data = await messageApi.getMessages(id, {
        limit: MESSAGES_PER_PAGE,
        offset: messageOffset,
      });
      const messagesList = Array.isArray(data) ? data : data.results || [];
      
      if (messagesList.length < MESSAGES_PER_PAGE) {
        setHasMore(false);
      }

      if (messageOffset === 0) {
        setMessages(messagesList);
        // Скроллим вниз после загрузки начальных сообщений
        setShouldScrollToBottom(true);
        setTimeout(() => {
          scrollToBottomInstant();
        }, 150);
      } else {
        // При подгрузке старых сообщений сохраняем позицию скролла
        const container = messagesContainerRef.current;
        const oldScrollHeight = container?.scrollHeight || 0;
        setMessages((prev) => [...messagesList, ...prev]);
        // Восстанавливаем позицию скролла после обновления
        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - oldScrollHeight;
          }
        }, 0);
      }
      setOffset(messageOffset + messagesList.length);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !wsRef.current) return;

    const messageText = newMessage.trim();
    
    // Создаем временное сообщение для оптимистичного обновления
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender_id: currentUser?.id,
      user: currentUser,
      created_at: new Date().toISOString(),
      isPending: true, // Флаг для отслеживания временных сообщений
    };
    
    // Добавляем сообщение сразу в UI
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');
    
    // Скроллим вниз после добавления сообщения
    setTimeout(() => {
      scrollToBottomInstant();
      setShouldScrollToBottom(true);
    }, 50);
    
    // Отправляем через WebSocket
    sendWebSocketMessage(wsRef.current, messageText);
  };

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearTop = container.scrollTop < 100;
    if (isNearTop && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      loadMessages(offset).finally(() => {
        setIsLoadingMore(false);
      });
    }

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    setShouldScrollToBottom(isNearBottom);
  }, [offset, hasMore, isLoadingMore]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const scrollToBottomInstant = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleBackClick = () => {
    // Закрываем WebSocket при выходе из чата
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setWsState(null);
    }
    navigate('/chats');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!conversation) {
    return (
      <div className="chat-page">
        <div className="error-message">Чат не найден</div>
        <Button onClick={handleBackClick}>Вернуться к чатам</Button>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <button className="chat-back" onClick={handleBackClick} aria-label="Назад">
          <FiArrowLeft />
        </button>

        <div className="chat-titlebar">
          <div className="chat-avatar" aria-hidden="true">
            {conversation.type === 'private' ? <FiMessageCircle /> : <FiUsers />}
          </div>
          <div className="chat-titlebar__meta">
            <div className="chat-titlebar__title">
              {conversation.title || `Чат #${conversation.id}`}
            </div>
            <div className="chat-titlebar__subtitle">
              {conversation.type === 'private' ? 'Личный чат' : 'Групповой чат'}
            </div>
          </div>
        </div>

        <button
          className="chat-fullscreen"
          onClick={() => setIsChatFullscreen?.(!isChatFullscreen)}
          aria-label={isChatFullscreen ? 'Выйти из полноэкранного режима' : 'Открыть чат на весь экран'}
          title={isChatFullscreen ? 'Обычный режим' : 'На весь экран'}
          type="button"
        >
          {isChatFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
        </button>
      </header>

      <div
        className="messages-container"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="loading-more">
            <Loader />
          </div>
        )}
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === currentUser?.id;
          const isGroupChat = conversation?.type === 'group';
          const showAuthor = isGroupChat && !isOwnMessage;
          const isPending = message.isPending;
          return (
            <div
              key={message.id}
              className={`message ${isOwnMessage ? 'message--own' : ''} ${isPending ? 'message--pending' : ''}`}
            >
              {showAuthor && (
                <div className="message-author">
                  {message.user?.username || 'Unknown'}
                </div>
              )}
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.created_at
                  ? new Date(message.created_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : ''}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <div className="composer">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Сообщение…"
            disabled={!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN}
          />
          <button
            className="send-btn"
            type="submit"
            aria-label="Отправить"
            disabled={!newMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN}
          >
            <FiSend />
          </button>
        </div>
      </form>
    </div>
  );
};

