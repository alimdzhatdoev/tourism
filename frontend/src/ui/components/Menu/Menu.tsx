import {FC, forwardRef} from 'react'
import {Box, BoxProps, Typography} from '@mui/material'
import {asx} from '@/core/utils'
import {styles as s} from './Menu.styles'
import {MENU_ITEMS} from './Menu.contents'
import {Link} from 'react-router-dom'
import {RootBlockProps} from '@/ui/components/_common/'
import {MainRootBlock} from '../../pages/main/MainRootBlock/MainRootBlock'

interface MenuProps extends RootBlockProps {
  itemSx?: BoxProps['sx']
}

export const Menu: FC<MenuProps> = forwardRef(
  ({sx, itemSx, ...blockProps}, ref) => {
    return (
      <MainRootBlock ref={ref} sx={[s.root, ...asx(sx)]} {...blockProps}>
        {MENU_ITEMS.map(item => (
          <Box
            key={item.path}
            to={item.path}
            component={Link}
            sx={[s.menuItem, ...asx(itemSx)]}
          >
            <item.Icon />
            <Typography sx={s.menuItemTitle}>{item.title}</Typography>
          </Box>
        ))}
      </MainRootBlock>
    )
  },
)
