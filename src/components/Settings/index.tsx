import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { DispatchContext } from '../../context';
import { TabPanel, a11yProps } from '../TabPanel';

const Settings = () => {
  const dispatch = useContext(DispatchContext);
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h4"
        color="primary.contrastText"
        textAlign="center"
        gutterBottom
      >
        Уровень сложности
      </Typography>
      <Paper>
        <Box sx={{ px: 2 }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            centered
            variant="fullWidth"
          >
            <Tab disableRipple label="Easy" {...a11yProps(0)} />
            <Tab disableRipple label="Medium" {...a11yProps(1)} />
            <Tab disableRipple label="Hard" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Typography variant="body1">Количество рядов: 8</Typography>
          <Typography variant="body1">Количество колонок: 8</Typography>
          <Typography variant="body1">Количество мин: 10</Typography>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              mt: 2,
            }}
            onClick={() => {
              dispatch({ type: 'selected_beginner' });
              navigate('/minesweeper/play');
              localStorage.setItem(
                'difficulty',
                JSON.stringify({
                  numberOfRows: 8,
                  numberOfColumns: 8,
                  numberOfMines: 10,
                })
              );
            }}
          >
            Играть
          </Button>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="body1">Количество рядов: 16</Typography>
          <Typography variant="body1">Количество колонок: 16</Typography>
          <Typography variant="body1">Количество мин: 40</Typography>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{ backgroundColor: 'warning.dark', mt: 2 }}
            onClick={() => {
              dispatch({ type: 'selected_intermediate' });
              navigate('/minesweeper/play');
              localStorage.setItem(
                'difficulty',
                JSON.stringify({
                  numberOfRows: 16,
                  numberOfColumns: 16,
                  numberOfMines: 40,
                })
              );
            }}
          >
            Играть
          </Button>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant="body1">Количество рядов: 16</Typography>
          <Typography variant="body1">Количество колонок: 32</Typography>
          <Typography variant="body1">Количество мин: 100</Typography>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{ backgroundColor: 'warning.dark', mt: 2 }}
            onClick={() => {
              dispatch({ type: 'selected_advanced' });
              navigate('/minesweeper/play');
              localStorage.setItem(
                'difficulty',
                JSON.stringify({
                  numberOfRows: 16,
                  numberOfColumns: 32,
                  numberOfMines: 100,
                })
              );
            }}
          >
            Играть
          </Button>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Settings;
