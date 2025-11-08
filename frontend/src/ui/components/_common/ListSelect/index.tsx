import {FC} from 'react'
import {asx, colorScheme} from '@/core/utils'
import {
  Box,
  MenuItem,
  MenuItemProps,
  Select,
  SelectProps,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export interface ListSelectItem {
  title: string
  value: string
}

export interface ListSelectProps extends SelectProps {
  items: Array<ListSelectItem>
  label?: string
  emptyLabel?: string
  slotProps?: SelectProps['slotProps'] &
    Partial<{
      menuItem: Partial<MenuItemProps>
    }>
}

export const ListSelect: FC<ListSelectProps> = ({
  items,
  label,
  slotProps,
  ...props
}) => {
  return (
    <Box
      sx={t => ({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        [t.breakpoints.down('lg')]: {
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '100%',
          gap: '13px',
        },
      })}
    >
      {label ? (
        <Typography
          sx={{
            fontSize: '16px',
            color: t => colorScheme(t).text.primary + ' !important',
          }}
        >
          {label}
        </Typography>
      ) : null}

      <Select
        IconComponent={() => null}
        defaultValue={items[0].value}
        sx={t => ({
          padding: '0 !important',
          minWidth: '193px',
          [t.breakpoints.down('lg')]: {
            width: '100%',
          },
        })}
        slotProps={{
          ...slotProps,
          root: {
            ...slotProps?.root,
            sx: [
              t => ({
                ['& .MuiSelect-select']: {
                  padding: '18px 54px 18px 24px !important',
                  border: `1px solid ${colorScheme(t).border.select}`,
                  borderRadius: '100px !important',
                  textTransform: 'uppercase',
                },
                [t.breakpoints.down('lg')]: {
                  ['& .MuiSelect-select']: {
                    padding: '14px 22px 14px 24px !important',
                  },
                },
              }),
              ...asx(slotProps?.root?.sx),
            ],
          },
        }}
        {...props}
      >
        {items.map(item => (
          <MenuItem
            key={item.value}
            value={item.value}
            {...slotProps?.menuItem}
          >
            {item.title}
          </MenuItem>
        ))}
      </Select>

      <Box
        sx={t => ({
          position: 'absolute',
          right: '14px',
          top: '30%',
          pointerEvents: 'none',
          [t.breakpoints.down('lg')]: {
            top: 'unset',
            bottom: '8%',
          },
        })}
      >
        <ExpandMoreIcon />
      </Box>
    </Box>
  )
}

const DEFAULT_ORDERING_ITEMS: Array<ListSelectItem> = [
  {value: 'created_dttm', title: 'Сначала новые'},
  {value: '-created_dttm', title: 'Сначала старые'},
]

export const OrderingSelect: FC<
  Omit<ListSelectProps, 'items'> & {items?: Array<ListSelectItem>}
> = ({items = DEFAULT_ORDERING_ITEMS, label = 'Сортировка:', ...props}) => {
  return <ListSelect items={items} label={label} {...props} />
}
