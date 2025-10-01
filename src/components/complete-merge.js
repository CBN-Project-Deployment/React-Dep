import React, { useState, useCallback } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  Switch,
  FormControlLabel,
  TextField,
  Stack,
  Tooltip,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility to generate grid data for demo purposes
function generateGridData(rows, cols, fixedRows, fixedCols) {
  const columns = Array.from({ length: cols }, (_, col) => ({
    field: `col${col}`,
    headerName: col < fixedCols ? `Fixed Col ${col}` : `Column ${col}`,
    width: 120,
    sortable: true,
    hide: false,
    headerClassName: col < fixedCols ? "fixedHeader" : "",
    disableColumnMenu: false,
    editable: true,
  }));

  const dataRows = Array.from({ length: rows }, (_, row) => {
    const rowObj = { id: row };
    columns.forEach((col, colIdx) => {
      if (row < fixedRows) {
        rowObj[col.field] = `Col ${colIdx}`;
      } else if (colIdx < fixedCols) {
        rowObj[col.field] = `Row ${row}`;
      } else {
        rowObj[col.field] = `${row * colIdx}`;
      }
    });
    return rowObj;
  });

  return { columns, dataRows };
}

export default function GridDemo() {
  // ------- State Management ---------
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(8);
  const [fixedRows, setFixedRows] = useState(1);
  const [fixedCols, setFixedCols] = useState(1);

  const [editable, setEditable] = useState(false);
  const [listMode, setListMode] = useState(true);
  const [singleSel, setSingleSel] = useState(true);
  const [vertLines, setVertLines] = useState(true);
  const [horzLines, setHorzLines] = useState(false);
  const [headerSort, setHeaderSort] = useState(false);
  const [allowColResize, setAllowColResize] = useState(false);
  const [allowRowResize, setAllowRowResize] = useState(false);
  const [italics, setItalics] = useState(false);
  const [titleTips, setTitleTips] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  const [showDrawer, setShowDrawer] = useState(false);

  // For Trace log (bottom box)
  const [traceMessages, setTraceMessages] = useState([]);

  // For DataGrid state
  const [selectionModel, setSelectionModel] = useState([]);

  // Generate grid columns/data any time shape changes
  const { columns, dataRows } = generateGridData(
    rows,
    cols,
    fixedRows,
    fixedCols
  );

  // --------- Event Handlers ----------
  const handleTrace = useCallback(
    (msg) => setTraceMessages((prev) => [...prev, msg]),
    []
  );

  const handleClearTrace = () => setTraceMessages([]);

  const handleCellEditStart = useCallback(
    (params, event) => handleTrace(`Start Edit: row ${params.id}, col ${params.field}`),
    [handleTrace]
  );

  const handleCellEditStop = useCallback(
    (params, event) => handleTrace(`End Edit: row ${params.id}, col ${params.field}`),
    [handleTrace]
  );

  const handleCellClick = useCallback(
    (params, event) => handleTrace(`Clicked: row ${params.id}, col ${params.field}`),
    [handleTrace]
  );

  const handleCellDoubleClick = useCallback(
    (params, event) => handleTrace(`Double Clicked: row ${params.id}, col ${params.field}`),
    [handleTrace]
  );

  const handleCellContextMenu = useCallback(
    (params, event) => {
      event.defaultMuiPrevented = true; // suppress default menu
      handleTrace(
        `Context menu on row ${params.id}, col ${params.field} (right click)`
      );
      toast.info(`Right click: row ${params.id}, col ${params.field}`);
    },
    [handleTrace]
  );

  // For enabling/disabling editing
  const processRowUpdate = useCallback(
    (newRow, oldRow) => {
      if (!editable) {
        toast.warn("Editing is disabled");
        return oldRow;
      }
      handleTrace(
        `Edited row ${oldRow.id}: ${JSON.stringify(oldRow)} => ${JSON.stringify(newRow)}`
      );
      return newRow;
    },
    [editable, handleTrace]
  );
   const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  // ---------- UI Controls ----------

  const handlePrint = () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Print</title></head><body>');
  printWindow.document.write('<h1>Grid Data</h1>');
  printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');

  // Add headers
  printWindow.document.write('<tr>');
  columns.forEach(col => {
    printWindow.document.write(`<th>${col.headerName}</th>`);
  });
  printWindow.document.write('</tr>');

  // Add rows
  dataRows.forEach(row => { // Use dataRows instead of data
    printWindow.document.write('<tr>');
    columns.forEach(col => {
      printWindow.document.write(`<td>${row[col.field]}</td>`);
    });
    printWindow.document.write('</tr>');
  });

  printWindow.document.write('</table>');
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
};

 const handleRowClick = (params) => {
    setExpandedRows((prev) =>
      prev.includes(params.id)
        ? prev.filter((id) => id !== params.id)
        : [...prev, params.id]
    );
  };

  const ControlPanel = (
    <Stack spacing={2} sx={{ width: 240, p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Grid Options</Typography>
        <IconButton onClick={handleDrawerClose} size="small" aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <TextField
        label="Rows"
        type="number"
        inputProps={{ min: 1, max: 999 }}
        value={rows}
        onChange={(e) => setRows(Number(e.target.value))}
        size="small"
      />
      <TextField
        label="Cols"
        type="number"
        inputProps={{ min: 1, max: 999 }}
        value={cols}
        onChange={(e) => setCols(Number(e.target.value))}
        size="small"
      />
      <TextField
        label="Fixed Rows"
        type="number"
        inputProps={{ min: 0, max: 5 }}
        value={fixedRows}
        onChange={(e) => setFixedRows(Number(e.target.value))}
        size="small"
      />
      <TextField
        label="Fixed Cols"
        type="number"
        inputProps={{ min: 0, max: 5 }}
        value={fixedCols}
        onChange={(e) => setFixedCols(Number(e.target.value))}
        size="small"
      />

      <FormControlLabel
        control={<Switch checked={editable} onChange={() => setEditable((v) => !v)} />}
        label="Editable"
      />
      <FormControlLabel
        control={<Switch checked={listMode} onChange={() => setListMode((v) => !v)} />}
        label="List Mode"
      />
      <FormControlLabel
        control={<Switch checked={singleSel} onChange={() => setSingleSel((v) => !v)} />}
        label="Single Select"
      />
      <FormControlLabel
        control={<Switch checked={vertLines} onChange={() => setVertLines((v) => !v)} />}
        label="Vertical Lines"
      />
      <FormControlLabel
        control={<Switch checked={horzLines} onChange={() => setHorzLines((v) => !v)} />}
        label="Horizontal Lines"
      />
      <FormControlLabel
        control={<Switch checked={headerSort} onChange={() => setHeaderSort((v) => !v)} />}
        label="Header Sort"
      />
      <FormControlLabel
        control={<Switch checked={allowColResize} onChange={() => setAllowColResize((v) => !v)} />}
        label="Allow Col Resize"
      />
      <FormControlLabel
        control={<Switch checked={allowRowResize} onChange={() => setAllowRowResize((v) => !v)} />}
        label="Allow Row Resize"
      />
      <FormControlLabel
        control={<Switch checked={italics} onChange={() => setItalics((v) => !v)} />}
        label="Italics"
      />
      <FormControlLabel
        control={<Switch checked={titleTips} onChange={() => setTitleTips((v) => !v)} />}
        label="Title Tips"
      />
      <Button
        variant="contained"
        onClick={handleClearTrace}
        color="secondary"
        size="small"
      >
        Clear Trace
      </Button>
    </Stack>
  );

  // ---------- Main Render ----------
  return (
    <Box sx={{ height: "100vh", bgcolor: "#f0f1f6" }}>
      <ToastContainer hideProgressBar/>

      {/* AppBar/Toolbar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setShowDrawer((v) => !v)}
            sx={{ mr: 2 }}
            aria-label="Open settings"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            GridCtrlDemo Modern
          </Typography>
           <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Show About">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() =>
                toast.info(
                  <>
                    <strong>Grid Control Demo</strong>
                    <div>Originally an MFC Demo. Now in React + MUI!</div>
                  </>
                )
              }
              size="small"
            >
              About
            </Button>

          </Tooltip>
            <Button
                      variant="outlined"
                      size="small"
                      color="inherit"
                      onClick={handlePrint}
                      sx={{ mr: 2 }}
                    >
                      Print
                    </Button>
                    </Box>
        </Toolbar>

      </AppBar>

      {/* Side Drawer with settings */}
      <Drawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        anchor="left"
        variant="temporary"
      >
        {ControlPanel}
      </Drawer>

      {/* Main content: Grid and Trace Log Box */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          maxWidth: "100vw",
          height: "calc(100vh - 64px)"
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 300,
            mb: 1,
            "& .fixedHeader": { bgcolor: "#e3edfa", fontWeight: "bold" },
            fontStyle: italics ? "italic" : "normal"
          }}
        >
          <DataGrid
            rows={dataRows}
            columns={columns}
            pageSize={Math.min(25, rows)}
            rowsPerPageOptions={[10, 25, 50, 100]}
            checkboxSelection={!singleSel}
            disableSelectionOnClick={false}
            onSelectionModelChange={setSelectionModel}
            selectionModel={selectionModel}
            onCellEditStart={handleCellEditStart}
            onCellEditStop={handleCellEditStop}
            onCellClick={handleCellClick}
            onCellDoubleClick={handleCellDoubleClick}
            onCellContextMenu={handleCellContextMenu}
            processRowUpdate={processRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
                components={{
              Row: (props) => {
                const isExpanded = expandedRows.includes(props.row.id);
                return (
                  <>
                    <props.components.Row {...props} />
                    {isExpanded && (
                      <Box sx={{ p: 1, bgcolor: "#e3f2fd" }}>
                        {props.row.details}
                      </Box>
                    )}
                  </>
                );
              },
            }}
            columnVisibilityModel={{
              // set example: Hide 2nd row/column? Controlled by more toggles
            }}
            sx={{
              border: 1,
              borderColor: "#aaa",
              // Grid lines mapping
              "& .MuiDataGrid-cell": {
                borderRight: vertLines ? "1px solid #ccc" : "none"
              },
              "& .MuiDataGrid-row": {
                borderBottom: horzLines ? "1px solid #ccc" : "none"
              }
            }}
            sortingOrder={headerSort ? ["asc", "desc"] : []}
            autoHeight={false}
          />
        </Box>
        {/* TRACE LOG */}
        <Box
          sx={{
            height: 120,
            bgcolor: "#fff",
            border: 1,
            borderColor: "#bbb",
            overflow: "auto",
            fontFamily: "monospace",
            p: 1,
            fontSize: 14,
          }}
        >
          {traceMessages.length === 0
            ? <Typography variant="caption" color="text.secondary">Trace log empty…</Typography>
            : traceMessages.slice(-8).map((msg, idx) =>
                <Typography key={idx} component="div">{msg}</Typography>
              )}
        </Box>
      </Box>
    </Box>
  );
}
