import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import { TablePagination } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateSharpIcon from '@material-ui/icons/UpdateSharp';

import TableDropDown from '../tableDropDown';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    {
        id: 'isModerator',
        label: 'Is-Moderator',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function StickyHeadTable({
    userRequests,
    acceptClicked,
    deleteClicked,
    btnName,
}) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell style={{ minWidth: 170 }}>
                                {btnName ? 'Update' : 'Accept'}
                            </TableCell>
                            <TableCell style={{ minWidth: 170 }}>
                                Delete
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userRequests
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((userRequest) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={userRequest.id}
                                    >
                                        {columns.map((column) => {
                                            const value =
                                                userRequest[column.id] + '';
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    {column.format &&
                                                    typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                className={classes.button}
                                                startIcon={<UpdateSharpIcon />}
                                                onClick={() =>
                                                    acceptClicked(
                                                        userRequest.id
                                                    )
                                                }
                                            >
                                                {btnName ? 'Update' : 'Accept'}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                className={classes.button}
                                                startIcon={<DeleteIcon />}
                                                onClick={() =>
                                                    deleteClicked(
                                                        userRequest.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div
                style={{
                    width: '20px',
                    marginTop: '15px',
                    marginLeft: '10px',
                }}
            >
                <TableDropDown
                    handleChange={handleChangeRowsPerPage}
                    val={rowsPerPage}
                />
            </div>
            <TablePagination
                component="div"
                count={userRequests.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}
