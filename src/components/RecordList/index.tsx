import React, { useContext } from 'react';
import { Typography, Box } from '@mui/material';
import { Context } from '../../context';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const RecordList = () => {
  const { recordList } = useContext(Context);
  recordList?.sort((a, b) => a.result - b.result);

  return (
    <Box>
      <Typography
        variant="h4"
        color="primary.contrastText"
        textAlign="center"
        gutterBottom
      >
        Топ 10
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: 'warning.dark',
                color: 'primary.contrastText',
              }}
            >
              <TableCell
                sx={{
                  color: 'inherit',
                }}
              >
                Игрок
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: 'inherit',
                }}
              >
                Результат
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recordList?.length === 0 ? (
              <TableRow>
                <TableCell component="th" scope="row">
                  ...
                </TableCell>
                <TableCell align="right">...</TableCell>
              </TableRow>
            ) : (
              recordList?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1 + '. ' + row.name}
                  </TableCell>
                  <TableCell align="right">{row.result}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecordList;
