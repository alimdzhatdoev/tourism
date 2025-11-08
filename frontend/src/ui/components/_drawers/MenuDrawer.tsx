// import {FC} from 'react'
// import {Divider, Drawer, Typography} from '@mui/material'
// import {HEADER_LINKS} from '@/constants'
// import {Link} from 'react-router-dom'
// import {AuthButton} from '..'

// export const MenuDrawer: FC<BaseModalProps> = ({isOpen, close, children}) => {
//   const handleClose = () => close()
//   return (
//     <Drawer
//       open={isOpen}
//       onClose={handleClose}
//       anchor='right'
//       PaperProps={{
//         sx: {
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '10px',
//           padding: '25px',
//           minWidth: '280px',
//         },
//       }}
//     >
//       <AuthButton />
//       <Divider sx={{margin: '15px 0 12px'}} />
//       <Typography
//         component={Link}
//         to={'/'}
//         onClick={handleClose}
//         sx={{fontSize: '16px'}}
//       >
//         Главная
//       </Typography>
//       {HEADER_LINKS.map(link => (
//         <Typography
//           key={link.path}
//           component={Link}
//           to={link.path}
//           onClick={handleClose}
//           sx={{fontSize: '16px'}}
//         >
//           {link.title}
//         </Typography>
//       ))}

//       {children}
//     </Drawer>
//   )
// }
