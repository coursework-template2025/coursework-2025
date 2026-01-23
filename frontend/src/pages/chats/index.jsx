import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { conversationApi } from '@/entities/conversation/api/conversationApi';
import { userApi } from '@/entities/user/api/userApi';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Button } from '@/shared/ui/Button/Button';
import { CreateChat } from '@/features/chat/create-chat';
import { removeToken } from '@/shared/lib/utils/cookies';
import { FiLogOut, FiMessageCircle, FiUsers } from 'react-icons/fi';
import './Chats.css';

export const ChatsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 900);
      }
    };
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [chatsData, userData] = await Promise.all([
        conversationApi.getList(),
        userApi.getMe(),
      ]);
      setChats(chatsData || []);
      setCurrentUser(userData);
    } catch (err) {
      if (err.response?.status === 401) {
        removeToken();
        navigate('/login');
      } else {
        setError('Ошибка при загрузке данных');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = (chatId) => {
    setIsChatFullscreen(false);
    navigate(`/chats/${chatId}`);
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleChatCreated = (newChat) => {
    setChats((prev) => [newChat, ...prev]);
    setIsChatFullscreen(false);
    navigate(`/chats/${newChat.id}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  const activeChatId = location.pathname.startsWith('/chats/')
    ? location.pathname.split('/')[2]
    : null;

  const shellModifierClass = isMobile
    ? activeChatId
      ? 'chats-shell--mobile-chat'
      : 'chats-shell--mobile-list'
    : isChatFullscreen
    ? 'chats-shell--fullscreen'
    : '';

  return (
    <div className={`chats-shell ${shellModifierClass}`}>
      <aside className="chats-sidebar">
        <header className="chats-header">
          <div className="header-content">
            <div className="header-left">
              <div className="brand">
                <FiMessageCircle size={18} />
                <span>Чаты</span>
              </div>
              <div className="user-pill">
                <span className="user-pill__name">{currentUser?.username}</span>
              </div>
            </div>

            <div className="header-actions">
              <CreateChat onChatCreated={handleChatCreated} />
              <Button variant="secondary" onClick={handleLogout} aria-label="Выйти">
                <FiLogOut />
                <span className="btn-text">Выход</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="chats-main">
          {error && <div className="error-message">{error}</div>}
          {chats.length === 0 ? (
            <div className="empty-state">
              <p>У вас пока нет чатов</p>
              <CreateChat onChatCreated={handleChatCreated} />
            </div>
          ) : (
            <div className="chats-list">
              {chats.map((chat) => {
                const isActive = String(chat.id) === String(activeChatId);
                return (
                  <div
                    key={chat.id}
                    className={`chat-item ${isActive ? 'chat-item--active' : ''}`}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <div className="chat-avatar" aria-hidden="true">
                      {chat.type === 'private' ? <FiMessageCircle /> : <FiUsers />}
                    </div>

                    <div className="chat-body">
                      <div className="chat-top">
                        <h3 className="chat-title">
                          {chat.title || `Чат #${chat.id}`}
                        </h3>
                        <span className="chat-type">
                          {chat.type === 'private' ? 'Личный' : 'Групповой'}
                        </span>
                      </div>

                      <div className="chat-preview">
                        {chat.last_message?.text || 'Нет сообщений'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </aside>

      <section className="chats-detail">
        <Outlet context={{ isChatFullscreen, setIsChatFullscreen }} />
      </section>
    </div>
  );
};

