import React, { useState, useContext } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { Context, DispatchContext } from '../../context';
import { PopupProps } from '../../types';

const Popup: React.FC<PopupProps> = ({ handleClose, open, time }) => {
  const [name, setName] = useState('');
  const dispatch = useContext(DispatchContext);
  const { settings, recordList } = useContext(Context);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (recordList !== undefined && time > 0) {
      recordList.sort((a, b) => a.result - b.result);
      dispatch({
        type: 'added_winner',
        payload: [
          ...recordList.slice(0, 9),
          {
            name: name.length < 3 ? 'Игрок' : name,
            result: time,
            difficulty: settings.numberOfMines,
          },
        ],
      });
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          gap: 2,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" textAlign="center">
          Новый рекорд!
        </Typography>
        <Typography variant="body1" textAlign="center">
          {`Ваш результат - ${time} секунд`}
        </Typography>
        <TextField
          id="outlined-basic"
          label="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          type="text"
          fullWidth
        />
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          Сохранить результат
        </Button>
      </Box>
    </Modal>
  );
};

export default Popup;
