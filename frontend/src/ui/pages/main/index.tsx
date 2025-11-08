import {FC} from 'react'
import {News} from './News/News'
import {Routes} from './Routes/Routes'
import {Services} from './Services'
import {FooterBackground} from './FooterBackground'
import {Feedback} from './Feedback'
import {Help} from './Help'
import {Places} from './Places'

const MainPage: FC = () => {
  return (
    <>
      <Places />
      <Routes />
      <Help />
      <News />
      <Services />
      <Feedback />
      <FooterBackground />
    </>
  )
}

export default MainPage
