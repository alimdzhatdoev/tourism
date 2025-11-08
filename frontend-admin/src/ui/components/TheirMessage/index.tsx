import { UserIcon } from '@app/assets/icons';
import { dateTimeFormats } from '@app/constants';
import { ChatMessage } from '@app/core/models';
import { FilePresent } from '@mui/icons-material';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  message: ChatMessage;
}
export const TheirMessage: React.FC<Props> = ({ message }) => {
  const {
    createdBy,
    createdDttm,
    message: messageText,
    file,
    fileName,
  } = message;
  const createdDate = dayjs(createdDttm).format(dateTimeFormats.dateTime);

  return (
    <div className="flex space-x-6">
      {createdBy.file ? (
        <img
          className="w-9 h-9 rounded-full"
          src={createdBy.file}
          alt="avatar"
        />
      ) : (
        <UserIcon className="w-9 h-9" color="#616C76" />
      )}
      <div className="flex flex-col items-end space-y-3 font-muller_regular">
        <div className="pl-[22px] pr-7 pt-[14px] pb-[18px] bg-menu_dark text-white rounded-xl max-w-max min-w-[192px]">
          <p className="max-w-[480px]">{messageText}</p>
          {file && messageText && (
            <a
              href={file}
              download={fileName}
              className="flex justify-end items-end space-x-1.5 text-sm cursor-pointer"
            >
              <span>{fileName ?? 'attached file'}</span>
              <FilePresent className="w-6 h-6" />
            </a>
          )}
          {file && !messageText && (
            <a
              href={file}
              download={fileName}
              className="flex items-center h-10 space-x-5 text-sm text-white cursor-pointer"
            >
              <div className="flex justify-center items-center bg-white bg-opacity-30 h-10 w-10 rounded-xl">
                <FilePresent />
              </div>
              <span>{fileName ?? 'attached file'}</span>
            </a>
          )}
        </div>
        <span className="text-xs text-[#9BA3B6] select-none">
          {createdDate}
        </span>
      </div>
    </div>
  );
};
