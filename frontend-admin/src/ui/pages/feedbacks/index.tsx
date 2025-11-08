import React from 'react';
import { dateTimeFormats } from '@app/constants';
import { LoadingProgress } from '@app/ui/components';
import { Box, ButtonBase, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useGetFeedbacksListQuery } from '@app/core/store/feedbacks';

const FeedbacksPage: React.FC = () => {
  const navigate = useNavigate();

  const feedbacksApi = useGetFeedbacksListQuery({ size: 9999 });

  const feedbacks = feedbacksApi.data?.data.results ?? [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        alignItems: 'stretch',
        flex: 1,
      }}
    >
      {feedbacks.map((feedback, index) => (
        <ButtonBase
          key={feedback.id}
          onClick={() => navigate(`/feedbacks/${feedback.id}`)}
        >
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '25px',
              padding: '20px',
              borderRadius: '15px',
              width: '100%',
            }}
          >
            <Typography>{index + 1}.</Typography>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                backgroundColor: t =>
                  !feedback.seenAt ? t.palette.warning.dark : undefined,
              }}
            />
            <Typography>
              {dayjs(feedback.createdAt).format(dateTimeFormats.date)}
            </Typography>
            <Typography>{feedback.name}</Typography>
            <Typography>Тема: {feedback.subject || 'не указана'}</Typography>
            <Typography>E-mail: {feedback.email || 'не указан'}</Typography>
            <Typography>Телефон: {feedback.phone || 'не указаны'}</Typography>
          </Paper>
        </ButtonBase>
      ))}

      {!feedbacks.length && !feedbacksApi.isLoading && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography className="text-2xl">Сообщения не найдены</Typography>
        </Box>
      )}

      <LoadingProgress show={feedbacksApi.isFetching} />
    </Box>
  );
};

export default FeedbacksPage;
