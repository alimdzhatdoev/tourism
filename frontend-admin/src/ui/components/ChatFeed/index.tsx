import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Chat, User } from '@app/core/models';
import { UserIcon } from '@app/assets/icons';
import { TheirMessage } from '../TheirMessage';
import { MyMessage } from '../MyMessage';
import { Formik, Form } from 'formik';
import { LocalButton } from '../LocalButton';
import {
  useCreateChatMessageMutation,
  useGetChatMessageListQuery,
  useUpdateChatMessageMutation,
} from '@app/core/store/chat_messages';
import { Button } from '@mui/material';
import { Clear, FilePresent, UploadFile } from '@mui/icons-material';
import { fileToBase64 } from '@app/utils';
import { LocalInput } from '../LocalInput';
import { useSelector } from 'react-redux';
import { userStateSelector } from '@app/core/store/user/selectors';
import { useGetUserQuery } from '@app/core/store/users';

interface Props {
  chat: Chat;
  className?: string;
}

export const ChatFeed: React.FC<Props> = ({ chat, className }) => {
  const messagesAnchorRef = useRef<HTMLDivElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [createChatMessageApi] = useCreateChatMessageMutation({});
  const { data } = useGetUserQuery({ id: chat.createdBy.id });

  const createdBy = useMemo(
    () => (data?.data ? new User(data.data) : new User({})),
    [data?.data],
  );

  const { user } = useSelector(userStateSelector);

  const [updateChatMessageApi] = useUpdateChatMessageMutation();

  const { data: messageData, refetch } = useGetChatMessageListQuery(
    { chat: chat.id, size: 100 },
    { pollingInterval: 3000 },
  );
  const messages = messageData?.data ? messageData.data.results : [];

  const messagesTimeline = messages.slice().reverse();

  const initialValues = {
    message: '',
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const markAsRead = useCallback(async () => {
    await Promise.all(
      messagesTimeline
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesTimeline.length]);

  const handleSendMessage = async (values: typeof initialValues) => {
    if (!values.message?.length && !uploadedFile) return;

    try {
      await createChatMessageApi({
        chat: chat.id,
        message: values.message,
        is_read: false,
        ...(uploadedFile && { file_base64: await fileToBase64(uploadedFile) }),
        ...(uploadedFile && { file_name: uploadedFile.name }),
      });
      setUploadedFile(null);

      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const scroll = () => {
    const timer = setTimeout(() => {
      messagesAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    scroll();
    markAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat, messagesTimeline.length]);

  return (
    <div
      className={cn(
        'bg-white h-full w-full flex flex-col px-4 py-8 rounded-xl min-h-[600px] max-h-[900px]',
        className,
      )}
    >
      <div className="w-full flex items-center space-x-5 px-16 pb-6 border-b border-[#B8BECB]">
        {createdBy.file ? (
          <img
            className="w-10 h-10 rounded-full"
            src={createdBy.file}
            alt="avatar"
          />
        ) : (
          <UserIcon className="w-10 h-10" color="#616C76" />
        )}
        <div>{createdBy.fullName}</div>
        <div>{createdBy.phone}</div>
        <div>{createdBy.email}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-14 my-7 space-y-4">
        {messagesTimeline.map(m => (
          <div className="w-full flex flex-col" key={m.id}>
            {m.createdBy.id === user?.id ? (
              <div className="self-end">
                <MyMessage message={m} />
              </div>
            ) : (
              <div className="self-start">
                <TheirMessage message={m} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesAnchorRef} />
      </div>
      <div className="mx-14">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { resetForm }) => {
            resetForm({ values: initialValues });
            await handleSendMessage(values);
          }}
        >
          {({ handleSubmit }) => (
            <Form>
              <div className="flex flex-col space-y-2">
                <LocalInput
                  name="message"
                  multiline
                  rows={2}
                  placeholder="Введите сообщение..."
                />
                <div className="flex justify-between">
                  {uploadedFile ? (
                    <div className="flex items-center space-x-2 h-9 text-sm text-yellow_text font-muller_regular">
                      <FilePresent />
                      <span>{uploadedFile.name}</span>
                      <Clear
                        onClick={() => setUploadedFile(null)}
                        className="cursor-pointer"
                      />
                    </div>
                  ) : (
                    <Button
                      component="label"
                      startIcon={<UploadFile />}
                      sx={{ marginRight: '1rem' }}
                    >
                      Загрузить файл
                      <input type="file" hidden onChange={handleFileUpload} />
                    </Button>
                  )}
                  <LocalButton
                    className="h-8"
                    type="submit"
                    onClick={() => handleSubmit}
                  >
                    Отправить
                  </LocalButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
