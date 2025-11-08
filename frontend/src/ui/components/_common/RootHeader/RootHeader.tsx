import {FC, PropsWithChildren} from 'react'
import {RootBlock, RootBlockProps} from '..'
import {BreadcrumbsProps, TypographyProps} from '@mui/material'
import {asx} from '@/core/utils'
import {LinkProps} from 'react-router-dom'
import {APP_FONTS} from '@/ui/themes/baseTheme'

type ChildrenToName<T extends PropsWithChildren> = Omit<T, 'children'> & {
  name: string
}

export type BreadcrumbLink = ChildrenToName<LinkProps>

export interface RootHeaderProps extends Omit<RootBlockProps, 'slotProps'> {
  links?: Array<BreadcrumbLink>
  uppercasedHeaderTitle?: boolean
  isLoading?: boolean
  slotProps?: RootBlockProps['slotProps'] &
    Partial<{
      breadcrumbs: Partial<BreadcrumbsProps>
      mainBreadcrumb: Partial<ChildrenToName<LinkProps>>
      currentBreadcrumb: Partial<TypographyProps>
    }>
}

export const RootHeader: FC<RootHeaderProps> = ({
  isLoading = false,
  slotProps,
  extraSlots,
  sx,
  ...blockProps
}) => {
  return (
    <RootBlock
      isLoading={isLoading}
      extraSlots={extraSlots}
      slotProps={{
        background: slotProps?.background,
        headerContainer: {
          ...slotProps?.headerContainer,
          sx: [
            {
              justifyContent: 'center',
            },
            ...asx(slotProps?.headerContainer?.sx),
          ],
        },
        headerLink: slotProps?.headerLink,
        headerTitle: {
          ...slotProps?.headerTitle,
          sx: [
            {
              textTransform: 'uppercase',
              fontFamily: APP_FONTS.oswald,
            },
            ...asx(slotProps?.headerTitle?.sx),
          ],
        },
      }}
      sx={[
        t => ({
          marginTop: '64px',
          [t.breakpoints.down('lg')]: {
            // padding: '0 16px',
            marginTop: '30px',
            marginBottom: '0px',
          },
        }),
        ...asx(sx),
      ]}
      {...blockProps}
    />
  )
}
