import {useTheme} from '@mui/material'
import {SetStateAction, useCallback, useEffect, useState} from 'react'

export type UseModalState<T> = {
  isOpen: boolean
  subscribe: boolean
  props?: T
}

export const useModal = <T extends unknown>(initialProps?: Partial<T>) => {
  const theme = useTheme()

  const [modalState, setModalState] = useState<UseModalState<T>>({
    isOpen: false,
    subscribe: false,
    props: initialProps as T,
  })

  const open = useCallback(
    (props: T) => setModalState(prev => ({...prev, isOpen: true, props})),
    [],
  )

  const close = useCallback(() => {
    setModalState(prev => ({...prev, subscribe: true, isOpen: false}))
  }, [])

  const set = useCallback(
    (value: SetStateAction<Omit<UseModalState<T>, 'subscribe'>>) => {
      setModalState(p =>
        typeof value === 'function' ? {...p, ...value(p)} : {...p, ...value},
      )
    },
    [],
  )

  useEffect(() => {
    if (modalState.subscribe && !modalState.isOpen) {
      setTimeout(
        () =>
          setModalState(prev => ({
            ...prev,
            subscribe: false,
            props: undefined,
          })),
        theme.transitions.duration.leavingScreen + 10,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.subscribe, modalState.isOpen])

  return {
    isOpen: modalState.isOpen,
    props: {...modalState.props!, onClose: close},
    control: {
      open: modalState.isOpen,
      onClose: close,
    },
    set,
    open,
    close,
  }
}
