import { FiMessageCircle } from 'react-icons/fi';
import './EmptyChat.css';

export const EmptyChatPage = () => {
  return (
    <div className="empty-chat">
      <div className="empty-chat__card">
        <div className="empty-chat__icon" aria-hidden="true">
          <FiMessageCircle />
        </div>
        <div className="empty-chat__title">Выберите чат слева</div>
        <div className="empty-chat__subtitle">
          Чтобы начать переписку, нажмите на диалог в списке.
        </div>
      </div>
    </div>
  );
};

