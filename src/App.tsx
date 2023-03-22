import { useReducer } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Minesweeper from './scenes/Minesweeper';
import StartingPage from './scenes/StartingPage';
import { Context, DispatchContext } from './context';
import reducer from './reducer';
import theme from './theme';

const settings = localStorage.getItem('difficulty')
  ? JSON.parse(localStorage.getItem('difficulty') as string)
  : { numberOfRows: 8, numberOfColumns: 8, numberOfMines: 10 };

const recordList = localStorage.getItem('recordList')
  ? JSON.parse(localStorage.getItem('recordList') as string)
  : [];

function App() {
  const [state, dispatch] = useReducer(reducer, {
    settings: settings,
    recordList: recordList,
  });

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/minesweeper/" element={<StartingPage />} />
            <Route path="/minesweeper/play" element={<Minesweeper />} />
          </Routes>
        </ThemeProvider>
      </DispatchContext.Provider>
    </Context.Provider>
  );
}

export default App;
