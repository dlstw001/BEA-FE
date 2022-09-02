import { useState, useEffect } from 'react';

// Custom components
import TableWithPagination from '../../components/table/TableWithPagination';
import AlertDialog from "../../components/dialog/Dialog";

// MUI Components
import { Box, Button } from "@mui/material";
import http from "../../api/http";

export default function SystemLog() {
  const [systemLogs, setSystemLogs] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);

  const onPageChange = (page) => {
    setPage(page);
  };

  const handleGetLog = async () => {
    const res = await http.get(`/log?page=${page + 1}`);
    let data = res.data;
    data.map((log) => {
      switch (log.method) {
        case "PUT":
          log.method = "Update";
          break;
        case "POST":
          log.method = "Create";
          break;
        case "DELETE":
          log.method = "Delete";
          break;
      }
      log.createdAt = new Date(log.createdAt).toLocaleString();
    });
    setSystemLogs(data);
    setRowCount(res.total);
  };

  useEffect(() => {
    handleGetLog();
  }, [page]);

  const columns = [
    { field: "user", headerName: "User", flex: 0.2, sortable: false },
    { field: "method", headerName: "Method", flex: 0.1, sortable: false },
    {
      field: "from",
      headerName: "From",
      flex: 0.4,
      renderCell: (params) => {
        let data = JSON.stringify(params.row.from);
        data = data?.replace("{", "").replace("}", "").split(",").map(item => <div key={Math.random()}>{item}</div>);
        return <AlertDialog buttonText={"Details"} content={data || "None"} />;
      },
      sortable: false,
    },
    {
      field: "to",
      headerName: "To",
      flex: 0.4,
      renderCell: (params) => {
        let data = JSON.stringify(params.row.to);
        data = data?.replace("{", "").replace("}", "").split(",").map(item => <div key={Math.random()}>{item}</div>);
        return <AlertDialog buttonText={"Details"} content={data || "None"} />;
      },
      sortable: false,
    },
    { field: "status", headerName: "Status", flex: 0.1, sortable: false },
    { field: "createdAt", headerName: "Date", flex: 0.2, sortable: false },
  ];

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <div>
          <h1>Log</h1>
        </div>
      </Box>
      <TableWithPagination
        columns={columns}
        rows={systemLogs}
        rowCount={rowCount}
        pagination={true}
        page={page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
