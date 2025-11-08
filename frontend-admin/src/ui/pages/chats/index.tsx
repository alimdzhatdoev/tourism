import React, { useState } from 'react';
import { useGetChatsListQuery } from '@app/core/store/chats';
import { ChatCard, ChatFeed, LocalButton } from '@app/ui/components/index';
import { Chat } from '@app/core/models';
import { Replay } from '@mui/icons-material';
import { useUpdateChatMessageMutation } from '@app/core/store/chat_messages';

const Chats: React.FC = () => {
  const { data, refetch } = useGetChatsListQuery(
    {
      expand: ['messages'],
    },
    { pollingInterval: 3000 },
  );

  const [updateChatMessageApi] = useUpdateChatMessageMutation();

  const chats = data?.data
    ? data.data.results
        .filter(c => c.messages.length)
        .sort((a, b) =>
          a.messages[0].createdDttm < b.messages[0].createdDttm ? 1 : -1,
        )
    : [];

  const [openChat, setOpenChat] = useState<Chat | null>(null);

  const markAsRead = async (chat: Chat) => {
    await Promise.all(
      chat.messages
        .filter(m => !m.createdBy.isAdmin && !m.isRead)
        .map(
          async m =>
            await updateChatMessageApi({
              id: m.id,
              chat: chat.id,
              is_read: true,
            }),
        ),
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-3xl">Чаты</span>
      </div>
      <div className="flex-1 flex space-x-14 mt-12">
        <div className="flex flex-col space-y-6">
          <LocalButton
            onClick={() => refetch()}
            className="flex justify-center items-center w-11 h-11 self-end"
          >
            <Replay />
          </LocalButton>
          {chats.map(c => (
            <ChatCard
              key={c.id}
              chat={c}
              handleClick={async () => {
                setOpenChat(c);
                await markAsRead(c);
              }}
            />
          ))}
        </div>
        {openChat && <ChatFeed chat={openChat} />}
      </div>
    </div>
  );
};

export default Chats;
