import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {ToastContainer, Slide} from 'react-toastify'
import store from '@core/store'
import {App} from './App'
import 'react-toastify/dist/ReactToastify.css'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ToastContainer
          position='bottom-left'
          autoClose={5000}
          hideProgressBar
          theme='light'
          transition={Slide}
          limit={5}
        />
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
