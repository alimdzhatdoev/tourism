import {asx} from '@/core/utils'
import {RootBlock, RootBlockProps} from '@/ui/components/_common'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {FC} from 'react'

interface MainRootBlockProps extends RootBlockProps {}

export const MainRootBlock: FC<MainRootBlockProps> = ({sx, ...props}) => {
  return (
    <RootBlock
      uppercasedHeaderTitle
      {...props}
      slotProps={{
        headerContainer: {
          sx: [
            theme => ({
              [theme.breakpoints.down('lg')]: {
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'flex-start',
                margin: '0 0 26px',
              },
            }),
            ...asx(props?.slotProps?.headerContainer?.sx),
          ],
        },
        headerLink: {
          sx: theme => ({
            [theme.breakpoints.down('lg')]: {
              fontSize: '14px',
              lineHeight: '18px',
            },
          }),
        },
        headerTitle: {
          sx: theme => ({
            textAlign: 'left',
            fontSize: '60px',
            fontWeight: 700,
            fontFamily: APP_FONTS.oswald,
            [theme.breakpoints.down('lg')]: {
              textTransform: 'unset',
            },
          }),
        },
      }}
      headerLink='Смотреть все'
      sx={[
        theme => ({
          borderRadius: '24px',
          margin: '0 0 56px',
          [theme.breakpoints.down('lg')]: {
            margin: '0 0 26px',
            borderRadius: 'unset',
          },
        }),
        ...asx(sx),
      ]}
    />
  )
}
