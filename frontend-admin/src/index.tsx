import React from 'react';
import dayjs from 'dayjs';
import localeRu from 'dayjs/locale/ru';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import { createTheme, Paper, ThemeProvider } from '@mui/material';
import { ClickToComponent } from 'click-to-react-component';
import { store } from '@app/core/store';
import { Layout, Router } from '@app/ui/components';
import 'react-toastify/dist/ReactToastify.min.css';
import '@app/index.css';

dayjs.locale(localeRu);

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#E9B21A',
    },
    error: {
      main: '#DA1B1B',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          color: '#22252E',
        },
        noOptions: {
          color: '#22252E',
        },
        paper: {
          backgroundColor: '#F5F6FA',
          color: '#22252E',
        },
        root: {
          '& .MuiAutocomplete-endAdornment path': {
            color: '#22252E',
          },
          '& label.Mui-focused': {
            fontFamily: 'Muller Regular',
            color: '#22252E',
          },
          '& .MuiOutlinedInput-root': {
            fontFamily: 'Muller Regular',
            backgroundColor: '#F5F6FA',
            color: '#22252E',
            borderRadius: 10,
            '& fieldset': {
              borderColor: '#4A4D55',
              fontFamily: 'Muller Regular',
            },
            '&:hover fieldset': {
              borderColor: '#22252E',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E9B21A',
            },
          },
        },
      },
      defaultProps: {
        PaperComponent: props => (
          <Paper
            {...props}
            style={{
              backgroundColor: '#F5F6FA',
              borderRadius: 24,
            }}
          />
        ),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontFamily: 'Muller Regular',
            backgroundColor: '#F5F6FA',
            color: '#22252E',
            borderRadius: 10,
            '& fieldset': {
              borderColor: '#4A4D55',
              fontFamily: 'Muller Regular',
            },
            '&:hover fieldset': {
              borderColor: '#191B21',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#E9B21A',
            },
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {},
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F5F6FA',
          backgroundImage: 'none',
          width: 450,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#22252E',
        },
        outlined: {
          color: '#22252E',
          fontFamily: 'Muller Regular',
          backgroundColor: '#F5F6FA',
          borderRadius: 10,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 10,
        },
        list: {
          backgroundColor: '#F5F6FA',
          color: 'black',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F6FA',
          borderBottom: '1px solid #292B33',
          fontFamily: 'Muller Regular',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Layout>
              <Router />
            </Layout>
            <ToastContainer
              limit={7}
              autoClose={1300}
              position="bottom-right"
              theme="dark"
              toastClassName="bg-menu_dark"
              progressClassName="bg-yellow_button"
              transition={Flip}
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
      <ClickToComponent />
    </>
  </React.StrictMode>,
);
