import React from 'react';
import cn from 'classnames';
import { Chat } from '@app/core/models';
import { DeliveredIcon, ReadIcon, UserIcon } from '@app/assets/icons';
import dayjs from 'dayjs';
import { dateTimeFormats } from '@app/constants';

interface Props {
  chat: Chat;
  className?: string;
  handleClick?: () => void;
}

export const ChatCard: React.FC<Props> = ({ chat, handleClick, className }) => {
  const { createdBy, createdDttm, adminUnreadMessageCount, messages } = chat;
  const createdTime = dayjs(createdDttm).format(dateTimeFormats.time);

  return (
    <div
      className={cn(
        'bg-white h-28 w-80 flex flex-col justify-between px-6 py-8 cursor-pointer rounded-xl active:scale-[.98] transition',
        className,
      )}
      onClick={handleClick}
    >
      <div className="h-full flex items-center space-x-2">
        <div className="flex flex-1 items-center space-x-2 text-sm">
          {createdBy.file ? (
            <img
              className="w-10 h-10 rounded-full"
              src={createdBy.file}
              alt="avatar"
            />
          ) : (
            <UserIcon className="w-10 h-10" color="#616C76" />
          )}
          <div className="flex flex-col justify-between">
            <span>{createdBy.fullName}</span>
            <p className="text-[#616C76] font-muller_light">
              {messages[0].message && (
                <span className="block">{messages[0].message}</span>
              )}
              {messages[0].file && (
                <span className="block text-menu_dark italic">
                  {messages[0].fileName || 'attached file'}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="w-10 flex flex-col items-end text-xs text-[#8FA0AF] space-y-1 font-muller_light">
          <span>{createdTime}</span>
          {adminUnreadMessageCount ? (
            <div className="flex items-center justify-center rounded-full bg-menu_dark w-[22px] h-[22px]">
              <span className="w-full h-full text-center text-white text-base font-muller_medium">
                {adminUnreadMessageCount}
              </span>
            </div>
          ) : (
            <div className="flex items-center w-[22px] h-[22px]">
              {messages[0].isRead ? <ReadIcon /> : <DeliveredIcon />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
