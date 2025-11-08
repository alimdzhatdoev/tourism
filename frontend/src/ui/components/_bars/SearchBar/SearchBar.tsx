import {ChangeEvent, KeyboardEventHandler, useState} from 'react'
import {BoxProps, Button, ButtonProps} from '@mui/material'
import {asx, hideOn} from '@/core/utils'
import {SearchField} from '../../_common'
import {BarWrapper} from '../BarWrapper'
import {styles as s} from './SearchBar.styles'
import {useSearchParams} from 'react-router-dom'
import {
  SearchFieldProps,
  SearchItem,
} from '../../_common/SearchField/SearchField'

interface SearchBarProps<Item extends SearchItem> extends BoxProps {
  slotProps?: Partial<{
    input: Partial<SearchFieldProps<Item>>
    button: Partial<ButtonProps>
  }>
  onSearchChange?: (value: string) => void
}

export const SearchBar = <Item extends SearchItem>({
  slotProps,
  sx,
  onSearchChange,
  ...containerProps
}: SearchBarProps<Item>) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setSearch(e.target.value)
    onSearchChange?.(e.target.value)
  }

  const handleClick = () => {
    setSearchParams(prev => {
      prev.delete('page')
      if (search) {
        prev.set('search', search)
      } else {
        prev.delete('search')
      }
      return prev
    })
    searchParams.set('search', search)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }

  return (
    <BarWrapper sx={[s.root, ...asx(sx)]} {...containerProps}>
      <SearchField
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...slotProps?.input}
      />

      <Button
        variant='contained'
        onClick={handleClick}
        {...slotProps?.button}
        sx={[s.button, hideOn('down', 'lg'), ...asx(slotProps?.button?.sx)]}
      >
        {slotProps?.button?.children ?? 'Найти'}
      </Button>
    </BarWrapper>
  )
}
