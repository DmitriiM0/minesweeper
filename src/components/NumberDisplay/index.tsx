import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface NumberDisplayProps {
  value: number;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          background: '#222',
          borderRadius: '6px',
          color: '#ff0701',
          px: 2,
          py: 0.5,
        }}
      >
        {value < 0
          ? `-${Math.abs(value).toString().padStart(2, '0')}`
          : value.toString().padStart(3, '0')}
      </Typography>
    </Box>
  );
};

export default NumberDisplay;
