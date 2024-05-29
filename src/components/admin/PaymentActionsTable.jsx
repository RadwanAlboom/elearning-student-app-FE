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
import UpdateSharpIcon from "@material-ui/icons/UpdateSharp";
import Button from "@material-ui/core/Button";
import TableDropDown from "../tableDropDown";

const columns = [
    { id: "course", label: "المساق", minWidth: 100 },
    { id: "teacher", label: "المعلم", minWidth: 100 },
    { id: "classcourse", label: "المساق المخصص", minWidth: 100 },
    { id: "chapter", label: "الفصل", minWidth: 100 },
    { id: "payment", label: "(شيقل) الدفع", minWidth: 100 },
];

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },

    button: {
        backgroundColor: "#292828",
        "&:hover": {
            backgroundColor: "#000",
        },
    },
});

export default function PaymentActionsTable({ actions, updatePaymentClicked }) {
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
                            <TableCell style={{ maxWidth: 170 }}>
                                المعرف
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell style={{ maxWidth: 170 }}>
                                تحديث
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {actions
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((action) => {
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={
                                            action.chapterId +
                                            "-" +
                                            action.userId
                                        }
                                    >
                                        <TableCell>
                                            {action.chapterId + "-" + action.userId}
                                        </TableCell>
                                        {columns.map((column) => {
                                            const value =
                                                action[column.id] + "";
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    {column.format &&
                                                    typeof value === "number"
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
                                                startIcon={<UpdateSharpIcon />}
                                                onClick={() => updatePaymentClicked(action)}
                                            >
                                                تحديث
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
                    width: "20px",
                    marginTop: "15px",
                    marginLeft: "10px",
                }}
            >
                <TableDropDown
                    handleChange={handleChangeRowsPerPage}
                    val={rowsPerPage}
                />
            </div>
            <TablePagination
                component="div"
                count={actions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            />
        </Paper>
    );
}
