import {ChangeEvent, FC, useEffect} from 'react'
import {BoxProps, Pagination, PaginationProps} from '@mui/material'
import {BarWrapper} from '../BarWrapper'
import {useSearchParams} from 'react-router-dom'

interface PaginationBarProps extends BoxProps {
  count?: PaginationProps['count']
  slotProps?: Partial<{
    pagination: Partial<PaginationProps>
  }>
}

export const PaginationBar: FC<PaginationBarProps> = ({
  count,
  slotProps,
  ...wrapperProps
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)

  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    setSearchParams(prev => {
      prev.set('page', value.toString())
      return prev
    })
  }

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
  }, [page])

  if (!count) {
    return <></>
  }

  return (
    <BarWrapper {...wrapperProps}>
      <Pagination
        count={count}
        page={page}
        onChange={handleChange}
        siblingCount={0}
        {...slotProps?.pagination}
      />
    </BarWrapper>
  )
}
