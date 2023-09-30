import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";

const CustomTable = ({ data, columns, columnFunctions, additionalCells }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <TableCell key={index}>{column}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((shipment, index) => (
          <TableRow key={index}>
            {columns.map((column, index) => (
              <TableCell key={index}>
                {columnFunctions[column]
                  ? columnFunctions[column](shipment[column])
                  : shipment[column]}
              </TableCell>
            ))}
            {additionalCells}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
