import * as React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

interface Props {
  colSpan: number;
  limit: number;
}

export const TableSkeleton: React.FC<Props> = ({ colSpan, limit }) => {
  return (
    <React.Fragment>
      {new Array(limit).fill(0).map((x, i) => (
        <TableRow key={i}>
          <TableCell colSpan={colSpan}>
            <Skeleton />
          </TableCell>
        </TableRow>
      ))}
    </React.Fragment>
  );
};
