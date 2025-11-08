import {FC, ReactNode} from 'react'
import {
  Box,
  BoxProps,
  Skeleton,
  Typography,
  TypographyProps,
} from '@mui/material'
import {Link, LinkProps} from 'react-router-dom'
import {Background, BackgroundProps} from '../Background/Background'
import {asx, casx} from '@/core/utils'
import {styles as s} from './RootBlock.styles'

export const RootBlockHeaderLink: FC<TypographyProps<typeof Link>> = ({
  sx,
  ...props
}) => {
  return (
    <Typography component={Link} sx={[s.headerLink, ...asx(sx)]} {...props} />
  )
}

type RootBlockVariants = 'primary' | 'secondary'

export interface RootBlockProps extends BoxProps {
  headerTitle?: string
  headerLink?: string
  headerLinkTo?: string
  uppercasedHeaderTitle?: boolean
  variant?: RootBlockVariants
  isLoading?: boolean
  slotProps?: Partial<{
    headerContainer: Partial<BoxProps>
    headerTitle: Partial<TypographyProps>
    headerLink: Partial<TypographyProps<typeof Link, LinkProps>>
    background: Partial<BackgroundProps>
  }>
  extraSlots?: Partial<{
    beforeHeaderContainer: ReactNode
    afterHeaderTitle: ReactNode
  }>
  noPadding?: boolean
  hide?: boolean
  headerWithLine?: boolean
}

export const RootBlock: FC<RootBlockProps> = ({
  children,
  headerTitle,
  headerLink,
  headerLinkTo,
  sx,
  slotProps,
  extraSlots,
  uppercasedHeaderTitle = false,
  isLoading = false,
  variant = 'primary',
  noPadding = false,
  hide = false,
  headerWithLine = false,
  ...containerProps
}) => {
  if (hide) {
    return null
  }
  const component = (
    <Box
      sx={[
        s.root,
        ...casx(noPadding, theme => ({
          [theme.breakpoints.down('lg')]: {
            padding: 0,
          },
        })),
        ...asx(sx),
      ]}
      {...containerProps}
    >
      {extraSlots?.beforeHeaderContainer
        ? extraSlots.beforeHeaderContainer
        : null}
      {headerTitle || isLoading ? (
        <Box
          {...slotProps?.headerContainer}
          sx={[
            s.header,
            ...casx(noPadding, theme => ({
              [theme.breakpoints.down('lg')]: {
                padding: '0 16px',
              },
            })),
            ...casx(variant === 'secondary', s.headerSecondary),
            ...asx(slotProps?.headerContainer?.sx),
          ]}
        >
          <Typography
            variant='h1'
            {...slotProps?.headerTitle}
            sx={[
              s.headerTitle,
              ...casx(uppercasedHeaderTitle, {textTransform: 'uppercase'}),
              ...casx(variant === 'secondary', s.headerTitleSecondary),
              ...asx(slotProps?.headerTitle?.sx),
            ]}
          >
            {isLoading ? <Skeleton width='420px' /> : headerTitle}
          </Typography>

          {headerWithLine ? <Box sx={s.headerLine} /> : null}

          {extraSlots?.afterHeaderTitle ? extraSlots.afterHeaderTitle : null}

          {headerLink && headerLinkTo ? (
            <RootBlockHeaderLink to={headerLinkTo} {...slotProps?.headerLink}>
              {isLoading ? <Skeleton /> : headerLink}
            </RootBlockHeaderLink>
          ) : null}
        </Box>
      ) : null}
      {children}
    </Box>
  )

  if (slotProps?.background) {
    return <Background {...slotProps.background}>{component}</Background>
  } else {
    return component
  }
}
