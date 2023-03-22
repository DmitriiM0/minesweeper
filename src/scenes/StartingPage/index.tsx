import React from 'react';
import Settings from '../../components/Settings';
import { Container, Box } from '@mui/material';
import RecordList from '../../components/RecordList';

const StartingPage: React.FC = () => {

  return (
    <Container maxWidth="sm">
      <Box display='flex' sx={{flexDirection: 'column', gap: 8, my: 6}}>
        <Settings />
        <RecordList />
      </Box>
    </Container>
  );
};

export default StartingPage;
