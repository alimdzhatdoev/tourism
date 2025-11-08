import {miscStateSelector} from '@/core/store/misc'
import {asx} from '@/core/utils'
import {Avatar, Box, BoxProps, Typography} from '@mui/material'
import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Rating} from '../Rating/Rating'
import {Attraction, Route} from '@/core/models'
import {useModal} from '@/core/hooks'
import {AuthorizationModalProps} from '../_modals/AuthorizationModal'
import {ReviewModalProps} from '../_modals/ReviewModal'

interface AddReviewProps extends BoxProps {
  entityId: Attraction['id'] | Route['id']
  entityType: 'attraction' | 'route'
  entityName: string
  onAdd?: () => void
}

export const AddReview: React.FC<AddReviewProps> = ({
  sx,
  entityId,
  entityType,
  entityName,
  onAdd,
  ...props
}) => {
  const {user} = useSelector(miscStateSelector)

  const authorizationModal = useModal<AuthorizationModalProps>()
  const reviewModal = useModal<ReviewModalProps>()

  const handleRatingClick = async (value: number) => {
    reviewModal.open({entityType, entityId, entityName, onAdd, rating: value})
    if (user) return
    authorizationModal.open({
      onDismiss: reviewModal.close,
    })
  }

  useEffect(() => {
    return () => {
      reviewModal.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box
      sx={[
        t => ({
          gap: '20px',
          display: 'flex',
          marginTop: '10px',
          marginBottom: '30px',
          alignItems: 'center',
          [t.breakpoints.down('lg')]: {
            padding: '0 16px',
            flexWrap: 'wrap',
            marginTop: '5px',
          },
        }),
        ...asx(sx),
      ]}
      {...props}
    >
      {user ? (
        <Avatar
          sx={{height: '50px', width: '50px', fontSize: '18px'}}
          src={user.avatar}
        >
          {user.avatarFallback}
        </Avatar>
      ) : null}
      <Box>
        {user ? (
          <Typography fontWeight={600}>{user.fullName}</Typography>
        ) : null}
        <Typography>Оцените и напишите отзыв</Typography>
      </Box>
      <Box
        sx={t => ({
          [t.breakpoints.down('md')]: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          },
        })}
      >
        <Rating
          sx={t => ({
            transform: 'scale(150%)',
            marginLeft: '40px',
            [t.breakpoints.down('md')]: {
              marginTop: '10px',
              marginBottom: '10px',
              marginLeft: '0px',
              transform: 'scale(200%)',
            },
          })}
          onChange={handleRatingClick}
          addMode
        />
      </Box>
    </Box>
  )
}
