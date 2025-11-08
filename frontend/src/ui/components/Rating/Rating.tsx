import {FC, useState} from 'react'
import {
  Box,
  BoxProps,
  SvgIconOwnProps,
  Typography,
  TypographyProps,
} from '@mui/material'
import {styles as s} from './Rating.styles'
import {asx, colorScheme} from '@/core/utils'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarIcon from '@mui/icons-material/Star'
import {pluralize} from '@/core/utils/pluralize'

type StarEqualities = 'not' | 'strict' | 'notstrict'

interface RatingStarProps extends SvgIconOwnProps {
  equality: StarEqualities
}

const RatingStar: FC<RatingStarProps> = ({equality, ...props}) => {
  if (equality === 'not') {
    return <StarOutlineIcon {...props} />
  }
  if (equality === 'notstrict') {
    return <StarHalfIcon {...props} />
  }
  return <StarIcon {...props} />
}

const RATING_STARS = [1, 2, 3, 4, 5]
const DEFAULT_RATING = 0

const getEquality = (
  currentValue: number,
  fullValue: number,
): StarEqualities => {
  if (currentValue > fullValue) {
    const prevValue = currentValue - 1

    if (fullValue > prevValue) {
      return 'notstrict'
    }

    return 'not'
  }

  return 'strict'
}

export interface RatingProps extends Omit<BoxProps, 'onChange'> {
  rating?: number
  reviewsCount?: number
  slotProps?: Partial<{
    ratingStar: Partial<RatingStarProps>
    reviewsCount: Partial<TypographyProps>
  }>
  addMode?: boolean
  wasSet?: boolean
  onChange?: (newValue: number) => void
}

export const Rating: FC<RatingProps> = ({
  rating,
  sx,
  reviewsCount,
  slotProps,
  addMode = false,
  wasSet: extrnalWasSet = false,
  onChange,
  ...containerProps
}) => {
  const [ratingValue, setRatingValue] = useState(rating ?? DEFAULT_RATING)
  const [wasSet, setWasSet] = useState(extrnalWasSet)

  const handleStarHover = (star: number) => () => {
    if (!addMode || wasSet) return
    setRatingValue(star)
  }
  const handleStarLeave = () => {
    if (!addMode || wasSet) return
    setRatingValue(DEFAULT_RATING)
  }

  const handleClick = (value: number) => () => {
    if (!addMode) return
    setWasSet(true)
    setRatingValue(value)
    onChange?.(value)
  }

  return (
    <Box sx={[s.root, ...asx(sx)]} {...containerProps}>
      {RATING_STARS.map(star => (
        <Box
          onMouseOver={handleStarHover(star)}
          onMouseLeave={handleStarLeave}
          onClick={handleClick(star)}
          width='24px'
          height='24px'
          key={star}
          sx={[addMode && {cursor: 'pointer'}]}
        >
          <RatingStar
            key={star}
            equality={getEquality(star, ratingValue)}
            {...slotProps?.ratingStar}
            sx={[
              s.star,
              addMode &&
                getEquality(star, ratingValue) === 'not' &&
                (t => ({
                  color: colorScheme(t).border.divider,
                })),
              ...asx(slotProps?.ratingStar?.sx),
            ]}
          />
        </Box>
      ))}
      {reviewsCount ? (
        <Typography
          {...slotProps?.reviewsCount}
          sx={[s.reviewsCount, ...asx(slotProps?.reviewsCount?.sx)]}
        >{`(${pluralize(reviewsCount, 'отзыв', {
          one: '',
          few: 'а',
          many: 'ов',
        })})`}</Typography>
      ) : null}
    </Box>
  )
}
