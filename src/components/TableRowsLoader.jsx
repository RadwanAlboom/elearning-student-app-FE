import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const TableRowsLoader = ({ rowsNum, columnsNum }) => {
    return [...Array(rowsNum)].map((row, index) => (
      <TableRow key={index}>
        {
            [...Array(columnsNum)].map((column, index) => (
                <TableCell key={index}>
                    <Skeleton />
                </TableCell>
            ))
        }
      </TableRow>
    ));
};

export default TableRowsLoader;