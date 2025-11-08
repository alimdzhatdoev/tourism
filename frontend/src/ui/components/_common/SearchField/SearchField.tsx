import {
  ChangeEventHandler,
  FocusEventHandler,
  Key,
  KeyboardEventHandler,
  SyntheticEvent,
  useRef,
  useState,
} from 'react'
import {
  ClickAwayListener,
  Fade,
  InputAdornment,
  Paper,
  Popper,
  SvgIcon,
  TextField,
  TextFieldProps,
  TextFieldVariants,
  Typography,
} from '@mui/material'
import {SearchIcon} from '@/assets/svg'
import {asx, colorScheme} from '@/core/utils'
import {styles as s} from './SearchField.styles'
import {Link} from 'react-router-dom'

export interface SearchItem {
  key: Key
  label: string
  navigateTo?: string
}

export type SearchFieldProps<
  Item extends SearchItem,
  Variant extends TextFieldVariants = TextFieldVariants,
> = {
  variant?: Variant
  items?: Array<Item>
  isLoading?: boolean
  onItemClick?: (item: Item) => void
} & Omit<TextFieldProps<Variant>, 'variant'>

export const SearchField = <
  Item extends SearchItem,
  Variant extends TextFieldVariants,
>({
  sx,
  InputProps,
  items,
  isLoading,
  onItemClick,
  onChange,
  onKeyDown,
  ...props
}: SearchFieldProps<Item, Variant>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [showPopper, setShowPopper] = useState<boolean>(false)

  const id = showPopper ? 'transition-popover' : undefined

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = event => {
    onChange?.(event)
    setShowPopper(true)
  }

  const handleClickAway = (event: Event | SyntheticEvent) => {
    if (ref.current?.contains(event.target as HTMLElement)) {
      return
    }
    setShowPopper(false)
  }

  const handleFocus: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = event => {
    setShowPopper(Boolean(event.target.value))
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    onKeyDown?.(event)
    if (event.key === 'Enter') {
      setShowPopper(false)
    }
  }

  return (
    <>
      <TextField
        ref={ref}
        placeholder='Поиск'
        {...props}
        sx={[s.root, ...asx(sx)]}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: InputProps?.startAdornment ?? (
            <InputAdornment position='start' sx={s.startAdoornment}>
              <SvgIcon component={SearchIcon} />
            </InputAdornment>
          ),
          // endAdornment: InputProps?.endAdornment ?? (
          //   <InputAdornment position='end' sx={s.endAdoornment}>
          //     <IconButton>
          //       <SvgIcon component={FiltersIcon} />
          //     </IconButton>
          //   </InputAdornment>
          // ),
          ...InputProps,
          onFocus: handleFocus,
          sx: [s.input, ...asx(InputProps?.sx)],
        }}
      />
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          id={id}
          open={showPopper && !isLoading}
          anchorEl={ref.current}
          sx={{zIndex: 10, width: ref.current?.clientWidth}}
          disablePortal
          transition
        >
          {({TransitionProps}) => (
            <Fade {...TransitionProps}>
              <Paper
                sx={{
                  width: '100%',
                  margin: '10px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {!items?.length && !isLoading ? (
                  <Typography sx={{padding: '10px'}}>
                    Ничего не найдено
                  </Typography>
                ) : null}
                {items?.length
                  ? items.map(r => (
                      <Typography
                        key={r.key}
                        component={Link}
                        sx={t => ({
                          cursor: 'pointer',
                          padding: '10px',
                          '&:hover': {
                            backgroundColor:
                              colorScheme(t).background.searchResultHovered,
                          },
                        })}
                        onClick={() => onItemClick?.(r)}
                        to={r.navigateTo ?? ''}
                      >
                        {r.label}
                      </Typography>
                    ))
                  : null}
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </>
  )
}
