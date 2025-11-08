import {FC, ReactNode} from 'react'
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Skeleton,
  Typography,
} from '@mui/material'
import {Rating, RatingProps} from '../../Rating/Rating'
import {REVIEWS_BLOCK_ID} from '@/constants/misc'
import {asx, createStyles} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'

interface ProductHeaderProps extends BoxProps {
  productName?: string
  ratingProps?: RatingProps
  isLoading?: boolean
  buttonProps?: ButtonProps
  leftSideChildren?: ReactNode
}

export const ProductHeader: FC<ProductHeaderProps> = ({
  productName,
  isLoading,
  ratingProps,
  sx,
  children,
  buttonProps,
  leftSideChildren,
  ...props
}) => {
  return (
    <Box sx={[s.root, ...asx(sx)]} {...props}>
      <Box sx={[s.side, {maxWidth: '40%', width: '100%'}]}>
        {productName || isLoading ? (
          <Typography sx={s.title}>
            {isLoading ? <Skeleton width='100%' /> : productName}
          </Typography>
        ) : null}

        {ratingProps && !isLoading ? (
          <Rating
            {...ratingProps}
            onClick={() => {
              if (ratingProps.reviewsCount === 0) return
              const reviewsBlock = document.getElementById(REVIEWS_BLOCK_ID)
              reviewsBlock?.scrollIntoView({behavior: 'smooth'})
            }}
            sx={[
              s.rating,
              !!ratingProps.reviewsCount && {cursor: 'pointer'},
              ...asx(ratingProps.sx),
            ]}
          />
        ) : null}

        {leftSideChildren}

        {!isLoading && buttonProps ? (
          <Button
            variant='outlined'
            sx={{
              color: t => t.palette.text.primary,
              textTransform: 'uppercase',
              fontWeight: 500,
              alignSelf: 'center',
            }}
            {...buttonProps}
          >
            {buttonProps.children}
          </Button>
        ) : null}
      </Box>

      <Box sx={[s.side, {maxWidth: '60%', width: '100%'}]}>{children}</Box>
    </Box>
  )
}

const s = createStyles({
  root: t => ({
    display: 'flex',
    marginTop: '64px',
    width: '100%',
    gap: '60px',
    [t.breakpoints.down('lg')]: {
      padding: '0 16px',
      marginBottom: '10px',
    },
  }),
  title: {
    textAlign: 'left',
    fontSize: '36px',
    textTransform: 'uppercase',
    fontFamily: APP_FONTS.oswald,
    fontWeight: 500,
  },
  rating: {},
  side: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
})
