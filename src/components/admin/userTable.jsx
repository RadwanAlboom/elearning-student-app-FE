import React from 'react';
import { Link } from 'react-router-dom';
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
import BlockIcon from '@material-ui/icons/Block';

import TableDropDown from '../tableDropDown';

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'phone', label: 'Phone', minWidth: 100 },
    {
        id: 'isModerator',
        label: 'Is-Moderator',
        minWidth: 170,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    { id: 'fingerprint_count', label: 'Fingerprint Count', minWidth: 100 },
    { id: 'max_fingerprint_count', label: 'Max Fingerprint Count', minWidth: 100 },
    { id: 'login_count', label: 'Login Count', minWidth: 100 }
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 920,
    },
    
    button: {
        backgroundColor: '#292828',
        '&:hover': {
            backgroundColor: '#000',
        }
    }
});

export default function StickyHeadTable({
    students,
    acceptClicked,
    deleteClicked,
    btnName,
    updateUserBlockStatusClicked
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
                                devices Info
                            </TableCell>
                            <TableCell style={{ minWidth: 170 }}>
                                Payment Actions
                            </TableCell>
                            <TableCell style={{ minWidth: 170 }}>
                                Profile
                            </TableCell>
                            <TableCell style={{ minWidth: 170 }}>
                                {btnName ? 'Update' : 'Accept'}
                            </TableCell>
                            <TableCell style={{ minWidth: 170 }}>
                                Delete
                            </TableCell>
                            <TableCell style={{ minWidth: 170 }}>
                                Block/ Unblock
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((student) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={student.id}
                                    >
                                        {columns.map((column) => {
                                            const value =
                                                student[column.id] + '';
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
                                            <Link
                                                to={{
                                                    pathname: '/admin/device-info',
                                                    state: { studentId: student.id },
                                                }}
                                            >
                                                معلومات الاجهزة
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                to={{
                                                    pathname: '/admin/payment-actions',
                                                    state: { student },
                                                }}
                                            >
                                                إجراءات الدفع
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                to={{
                                                    pathname: '/student-profile',
                                                    state: { studentId: student.id },
                                                }}
                                            >
                                                    الملف الشخصي
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<UpdateSharpIcon />}
                                                onClick={() =>
                                                    acceptClicked(
                                                        student.id
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
                                                startIcon={<DeleteIcon />}
                                                onClick={() =>
                                                    deleteClicked(
                                                        student.id
                                                    )
                                                }
                                            >
                                                حذف
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                className={classes.button}
                                                startIcon={<BlockIcon />}
                                                onClick={() =>
                                                    updateUserBlockStatusClicked(
                                                        student.id, !student.isBlocked
                                                    )
                                                }
                                            >
                                                {student.isBlocked ? 'الغاء الحظر' : 'حظر'}
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
                count={students.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}
