import React, { useState } from "react";
import { data } from "./data/data";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import axios from "axios";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "first_name", headerName: "First Name", width: 170 },
  { field: "last_name", headerName: "Last Name", width: 170 },
  { field: "gender", headerName: "Gender", width: 130 },
  { field: "email", headerName: "Email", type: "String", width: 190 },
  { field: "ip_address", headerName: "IP Address", type: "String", width: 190 },
];

const DataTable = () => {
  const [rows, setRows] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(0);
const handleStoreRecords = async () => {
  try {
 
    const pageSize = 20;

    // Calculate the index of the first record on the current page
    const startIndex = currentPage * pageSize;

    // Slice the rows array to get the records on the current page
    const recordsOnCurrentPage = rows.slice(startIndex, startIndex + pageSize);

    

    const response = await axios.post("http://localhost:8000/api/userRecords", {
      records: recordsOnCurrentPage,
    });

    console.log("Records stored successfully:", response.data);

    // Move to the next page after storing records
    setCurrentPage((prevPage) => prevPage + 1);
  } catch (error) {
    console.error("Error storing records:", error);
  }
};


  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredRows = data.filter(
      (row) =>
        row.first_name.toLowerCase().includes(term) ||
        row.last_name.toLowerCase().includes(term)
    );

    setRows(filteredRows);
  };

  return (
    <div>
      <TextField
        label="Search User"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px" }}
      />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: currentPage, pageSize: 20 },
            },
          }}
          pageSize={20}
          onPageChange={(params) => setCurrentPage(params.page)}
          pagination
         checkboxSelection
        />
      </div>
      <button onClick={handleStoreRecords}>Store 20 Records</button>
    </div>
  );
};

export default DataTable;
