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
    { id: 'major', label: 'Major', minWidth: 100 },
    {
        id: 'isModerator',
        label: 'Is-Moderator',
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
    button: {
        backgroundColor: '#292828',
        '&:hover': {
            backgroundColor: '#000',
        }
    }
});

export default function StickyHeadTable({
    teachers,
    acceptClicked,
    deleteClicked,
    btnName,
    updateTeacherBlockStatusClicked
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
                        {teachers
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((teacher) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={teacher.id}
                                    >
                                        {columns.map((column) => {
                                            let value;
                                            if (column.id === 'isModerator') {
                                                value = teacher[column.id] === 0 ?
                                                <span style={{backgroundColor: 'yellow', fontWeight: 'bold', fontSize: '18px', padding: '5px 10px 5px 10px'}}>طالب</span> :
                                                <span style={{backgroundColor: 'lightgreen', fontWeight: 'bold', fontSize: '18px', padding: '5px 10px 5px 10px'}}>معلم</span>
                                            } else {
                                                value = teacher[column.id] + '';
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
                                            <Link
                                                to={{
                                                    pathname: '/teacherProfile',
                                                    state: { teacherId: teacher.id },
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
                                                        teacher.id
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
                                                        teacher.id
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
                                                    updateTeacherBlockStatusClicked(
                                                        teacher.id, !teacher.isBlocked
                                                    )
                                                }
                                            >
                                                {teacher.isBlocked ? 'الغاء الحظر' : 'حظر'}
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
                count={teachers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}
