import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

export default function CustomPagination({ rowCount }) {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  const [displayRowFrom, setDisplayRowFrom] = useState(null);
  const [displayRowTo, setDisplayRowTo] = useState(null);
  const [rowCountDisplay, setRowCountDisplay] = useState(rowCount);

  useEffect(() => {
    if (rowCount === 0) {
      setDisplayRowFrom(0);
    } else {
      setDisplayRowFrom(page * 10 + 1);
    }
    if (page * 10 + 10 > rowCount) {
      setDisplayRowTo(rowCount);
    } else {
      setDisplayRowTo(page * 10 + 10);
    }
    setRowCountDisplay(rowCount);
  }, [page, rowCount]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        margin: "0 20px",
      }}
    >
      <div>
        Results {displayRowFrom} - {displayRowTo} of {rowCountDisplay}
      </div>
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    </div>
  );
}
