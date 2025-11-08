import { dateTimeFormats } from '@app/constants';
import { ChatMessage } from '@app/core/models';
import { FilePresent } from '@mui/icons-material';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  message: ChatMessage;
}
export const MyMessage: React.FC<Props> = ({ message }) => {
  const { createdDttm, message: messageText, file, fileName } = message;
  const createdDate = dayjs(createdDttm).format(dateTimeFormats.dateTime);

  return (
    <div className="flex space-x-6">
      <div className="flex flex-col items-end space-y-3 font-muller_regular">
        <div className="pl-[22px] pr-7 pt-[14px] pb-[18px] border border-[#E2E9F2] text-[#707C97] rounded-xl max-w-max min-w-[192px]">
          <p className="max-w-[480px]">{messageText}</p>
          {file && messageText && (
            <a
              href={file}
              download={fileName}
              className="flex justify-end items-end space-x-1.5 text-sm text-menu_dark cursor-pointer"
            >
              <span>{fileName ?? 'attached file'}</span>
              <FilePresent className="w-6 h-6" />
            </a>
          )}
          {file && !messageText && (
            <a
              href={file}
              download={fileName}
              className="flex items-center h-10 space-x-5 text-sm text-menu_dark cursor-pointer"
            >
              <div className="flex justify-center items-center border border-menu_dark h-10 w-10 rounded-xl">
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
