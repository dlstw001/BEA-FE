import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#FFB81C',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(date, system, log) {
  return { date, system, log};
}

const rows = [
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
  createData('1/6/2022', 'MWS', 'Do sth'),
];

export default function LogTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{width:'230px'}}>Time</StyledTableCell>
            <StyledTableCell align="left" sx={{width:'230px'}}>User</StyledTableCell>
            <StyledTableCell align="left">Event</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.date}>
              <StyledTableCell component="th" scope="row">{row.date}</StyledTableCell>
              <StyledTableCell align="left">{row.system}</StyledTableCell>
              <StyledTableCell align="left">{row.log}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
