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

import TableRowsLoader from '../TableRowsLoader';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'phone', label: 'Phone', minWidth: 100 },
    {
        id: 'isModerator',
        label: 'Type',
        minWidth: 170,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    }
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 920,
    },
});

export default function StickyHeadTable({
    userRequests,
    pagination,
    loading,
    acceptClicked,
    deleteClicked,
    btnName,
    handleChangePage
}) {
    const classes = useStyles();

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
                        {
                            loading ? (
                                <TableRowsLoader rowsNum={pagination.limit} columnsNum={6} />
                            ) : (
                            userRequests
                            .map((userRequest) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={userRequest.id}
                                    >
                                        {columns.map((column) => {
                                            let value;
                                            if (column.id === 'isModerator') {
                                                value = userRequest[column.id] === 0 ?
                                                <span style={{backgroundColor: 'yellow', fontWeight: 'bold', fontSize: '18px', padding: '5px 10px 5px 10px'}}>طالب</span> :
                                                <span style={{backgroundColor: 'lightgreen', fontWeight: 'bold', fontSize: '18px', padding: '5px 10px 5px 10px'}}>معلم</span>
                                            } else {
                                                value = userRequest[column.id] + '';
                                            }

                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    {value}
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
                                                {btnName ? 'تحديث' : 'قبول'}
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
                                                حذف
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={pagination.totalUserRequests}
                rowsPerPage={pagination.limit}
                page={pagination.page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}
