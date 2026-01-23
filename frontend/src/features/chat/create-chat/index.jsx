import { useState } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { conversationApi } from '@/entities/conversation/api/conversationApi';
import { userApi } from '@/entities/user/api/userApi';
import './CreateChat.css';

export const CreateChat = ({ onChatCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('private');
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await userApi.searchUsers(query);
      setSearchResults(results || []);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearchUsers(query);
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (type === 'group' && !title.trim()) {
      setError('Для группового чата необходимо указать название');
      return;
    }

    if (selectedUsers.length === 0) {
      setError('Выберите хотя бы одного участника');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        type,
        participant_ids: selectedUsers.map((u) => u.id),
      };
      if (type === 'group') {
        data.title = title;
      }
      const newChat = await conversationApi.create(data);
      onChatCreated?.(newChat);
      setIsOpen(false);
      setTitle('');
      setSelectedUsers([]);
      setSearchQuery('');
      setType('private');
    } catch (err) {
      setError('Ошибка при создании чата');
      console.error('Error creating chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="primary">
        Создать чат
      </Button>
    );
  }

  return (
    <div className="create-chat-overlay" onClick={() => setIsOpen(false)}>
      <div className="create-chat-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Создать чат</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Тип чата</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setTitle('');
              }}
            >
              <option value="private">Личный</option>
              <option value="group">Групповой</option>
            </select>
          </div>

          {type === 'group' && (
            <Input
              label="Название чата"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          )}

          <div className="form-group">
            <Input
              label="Поиск пользователей"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Введите username..."
              disabled={isLoading}
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults
                  .filter((user) => !selectedUsers.find((u) => u.id === user.id))
                  .map((user) => (
                    <div
                      key={user.id}
                      className="search-result-item"
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.username} ({user.email})
                    </div>
                  ))}
              </div>
            )}
          </div>

          {selectedUsers.length > 0 && (
            <div className="selected-users">
              <label>Выбранные пользователи:</label>
              {selectedUsers.map((user) => (
                <div key={user.id} className="selected-user">
                  <span>{user.username}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                    className="remove-user-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

