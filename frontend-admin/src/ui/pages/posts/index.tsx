import React from 'react';
import { dateTimeFormats } from '@app/constants';
import { useGetPostsListQuery } from '@app/core/store/posts';
import { LoadingProgress, LocalButton } from '@app/ui/components';
import { Box, ButtonBase, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import noPhoto from '@app/assets/no-photo-placeholder.png';

const PostsPage: React.FC = () => {
  const navigate = useNavigate();

  const postsApi = useGetPostsListQuery({ size: 9999 });

  const posts = postsApi.data?.data.results ?? [];

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <LocalButton onClick={() => navigate('/posts/new')}>
          Добавить новость
        </LocalButton>
      </Box>

      {posts.map((post, index) => (
        <ButtonBase key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
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
              component="img"
              sx={[
                {
                  maxWidth: '40px',
                  maxHeight: '40px',
                  minWidth: '40px',
                  minHeight: '40px',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                },
                !post.cover && { opacity: 0.4 },
              ]}
              src={post.cover ?? noPhoto}
            />
            <Typography>
              {dayjs(post.createdDttm).format(dateTimeFormats.date)}
            </Typography>
            <Typography>
              {post.publishedAt ? 'Опубликована' : 'Не опубликована'}
            </Typography>
            <Typography>{post.section.name}</Typography>
            <Typography>{post.title}</Typography>
          </Paper>
        </ButtonBase>
      ))}

      {!posts.length && !postsApi.isLoading && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography className="text-2xl">Новости не найдены</Typography>
        </Box>
      )}

      <LoadingProgress show={postsApi.isFetching} />
    </Box>
  );
};

export default PostsPage;
