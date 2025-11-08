import {FC, MouseEvent, useState} from 'react'
import {
  alpha,
  Avatar,
  Button,
  ButtonBase,
  ButtonProps,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material'
import {useSelector} from 'react-redux'
import {miscStateSelector, setMiscState} from '@/core/store/misc'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {User} from '@/assets/svg'
import {appStorage, asx, colorScheme} from '@/core/utils'
import {useNavigate} from 'react-router-dom'
import {useModal} from '@/core/hooks'
import {
  AuthorizationModal,
  AuthorizationModalProps,
} from '../_modals/AuthorizationModal'
import {ModalController} from '../Modal'
import {Logout} from '@mui/icons-material'

const {clear} = appStorage()

interface AuthButtonProps extends ButtonProps {}

export const AuthButton: FC<AuthButtonProps> = ({sx, ...props}) => {
  const {user} = useSelector(miscStateSelector)

  const authorizationModal = useModal<AuthorizationModalProps>()

  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handlMenueClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    navigate('')
    setMiscState({isAuthorized: false, user: null})
    clear()
    handleClose()
  }

  const handleClick = () => {
    if (user) navigate('/profile')
    else authorizationModal.open({})
  }

  return (
    <>
      <Button
        onClick={handleClick}
        sx={[
          {
            gap: '9px',
            color: 'inherit',
          },
          ...asx(sx),
        ]}
        {...props}
      >
        <Avatar
          sx={{
            color: 'inherit',
            backgroundColor: t => alpha(colorScheme(t).text.primary, 0.1),
          }}
        >
          <User />
        </Avatar>

        {user ? (
          <>
            <ButtonBase onClick={handlMenueClick} sx={{height: '44px'}}>
              <ExpandMoreIcon />
            </ButtonBase>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
              <MenuItem onClick={logout}>
                <ListItemIcon>
                  <Logout fontSize='small' />
                </ListItemIcon>
                Выйти
              </MenuItem>
            </Menu>
          </>
        ) : null}
      </Button>

      <ModalController control={authorizationModal.control}>
        <AuthorizationModal {...authorizationModal.props} />
      </ModalController>
    </>
  )
}
