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
import { MdCancel } from 'react-icons/md';
import { FcOk } from 'react-icons/fc';

import TableDropDown from '../tableDropDown';
import { Link } from 'react-router-dom';

const columns = [
    { id: 'name', label: 'Exam name', minWidth: 170 },
    { id: 'studentName', label: 'Student name', minWidth: 170 },
    { id: 'successRate', label: 'Success Rate (%)', minWidth: 100 },
    { id: 'actualSuccessRate', label: 'Exam Success Rate (%)', minWidth: 100 },
    { id: 'grade', label: 'Grade', minWidth: 100 },
    { id: 'actualGrade', label: 'Exam Grade', minWidth: 100 },
    {
        id: 'status',
        label: 'Status',
        minWidth: 170,
        align: 'left',
    },
    { id: 'review', label: 'Review', minWidth: 100 },
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});

export default function StickyHeadTable({ examPreviews }) {
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {examPreviews
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((examPreview) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={examPreview.id}
                                    >
                                        {columns.map((column) => {
                                            const value =
                                                examPreview[column.id] + '';
                                            if (column.id === 'review') {
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        <Link
                                                            to={{
                                                                pathname:
                                                                    '/moderator/exams/review',
                                                                state: {
                                                                    examId: examPreview.id,
                                                                },
                                                            }}
                                                        >
                                                            Available
                                                        </Link>
                                                    </TableCell>
                                                );
                                            }
                                            if (column.id === 'status') {
                                                return examPreview[
                                                    column.id
                                                ] ? (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        <FcOk size="1.5rem" />
                                                    </TableCell>
                                                ) : (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        <MdCancel
                                                            color="red"
                                                            size="1.5rem"
                                                        />
                                                    </TableCell>
                                                );
                                            }
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
                count={examPreviews.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}
