import { ArrowOutlinedIcon } from '@app/assets/icons';
import { dateTimeFormats } from '@app/constants';
import {
  useGetFeedbackQuery,
  useSetFeedbackSeenMutation,
} from '@app/core/store/feedbacks';
import { FullscreenPreloader, LocalButton } from '@app/ui/components';
import { Box, Paper, Typography } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FeedbackPage: React.FC = () => {
  const { id: paramsId } = useParams();

  const navigate = useNavigate();

  const feddbackApi = useGetFeedbackQuery(
    paramsId
      ? {
          id: Number(paramsId),
        }
      : skipToken,
  );

  const feedback = feddbackApi.data?.data;

  const [setSeen] = useSetFeedbackSeenMutation();

  useEffect(() => {
    if (paramsId) setSeen({ id: Number(paramsId) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (feddbackApi.isLoading) {
    return <FullscreenPreloader />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <LocalButton
        asIcon
        variant="contained"
        onClick={() => navigate('/feedbacks')}
      >
        <ArrowOutlinedIcon direction="left" />
      </LocalButton>

      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '20px',
          borderRadius: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <Typography sx={{ fontSize: '24px' }}>{feedback?.name}</Typography>
          <Typography sx={{ fontSize: '16px' }}>
            {dayjs(feedback?.createdAt).format(dateTimeFormats.date)}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '20px' }}>
          E-mail: {feedback?.email || 'не указан'}
        </Typography>
        <Typography sx={{ fontSize: '20px' }}>
          Телефон: {feedback?.phone || 'не указан'}
        </Typography>

        <Typography sx={{ fontSize: '20px' }}>
          Тема: {feedback?.subject || 'не указанa'}
        </Typography>
        <Typography sx={{ fontSize: '20px', whiteSpace: 'pre-line' }}>
          Сообщение: {feedback?.message}
        </Typography>
      </Paper>
    </Box>
  );
};

export default FeedbackPage;
