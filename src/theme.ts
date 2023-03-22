import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e65100',
      light: '#f57c00',
      contrastText: '#fff',
    },
    background: {
      default: '#222',
    },
  },
});

export default theme;
