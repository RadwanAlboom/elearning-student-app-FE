import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import { TablePagination } from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import TableRowsLoader from "../TableRowsLoader";
import auth from '../../services/authService';

const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    { id: "payment", label: "Payment", minWidth: 100 },
];

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 920,
    },
});

export default function StudentsUnitTable({ 
    studentsUnit,
    pagination,
    loading,
    deleteClicked,
    handleChangePage
}) {
    const classes = useStyles();
    const currentUser = auth.getCurrentUser();
    
    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {
                                columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))
                            }

                            {
                                currentUser && currentUser.isAdmin && (
                                    <TableCell style={{ minWidth: 170 }}>
                                        Delete
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {   
                            loading ? (
                                <TableRowsLoader rowsNum={pagination.limit} columnsNum={(currentUser && currentUser.isAdmin) ? 4 : 3 } />
                            ) : (
                            studentsUnit
                            .map((user) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={user.id}
                                    >
                                        {columns.map((column) => {
                                            const value = user[column.id] + "";
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    {value}
                                                </TableCell>
                                            );
                                        })}

                                        {
                                            currentUser && currentUser.isAdmin && (
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        className={classes.button}
                                                        startIcon={<DeleteIcon />}
                                                        onClick={() =>
                                                            deleteClicked(user)
                                                        }
                                                    >
                                                        حذف
                                                    </Button>
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                );
                            }))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={pagination.totalUsersUnit}
                rowsPerPage={pagination.limit}
                page={pagination.page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}
