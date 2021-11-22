import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const DescriptiveTable = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table size={props.size} aria-label={props.ariaLabel}>
        <caption>{props.caption}</caption>
        <TableBody>
          {props.data.map((item) => (
            <TableRow key={item.title}>
              <TableCell component="th" scope="row">
                {item.title}
              </TableCell>
              <TableCell align="right">{item.data}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DescriptiveTable;
