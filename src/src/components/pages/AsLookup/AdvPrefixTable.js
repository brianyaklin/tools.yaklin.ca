import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import TablePaginationActions from "../../ui/TablePaginationActions";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: "450px",
  },
  noResults: {
    marginTop: theme.spacing(2),
  },
}));

const AdvPrefixTable = (props) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (props.prefixes.length === 0) {
    return (
      <Typography className={classes.noResults} type="subtitle1" align="center">
        No prefixes are advertised.
      </Typography>
    );
  }

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table
        className={classes.table}
        size="small"
        aria-label="advertised prefix table"
      >
        <TableHead>
          <TableRow>
            <Typography variant="h5" align="center">
              Advertised Prefixes
            </Typography>
          </TableRow>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              count={props.prefixes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? props.prefixes.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : props.prefixes
          ).map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {row.prefix}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdvPrefixTable;
