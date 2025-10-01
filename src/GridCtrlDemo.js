//import './App.css';
import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Snackbar,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";

function generateColumns(columnCount, fixCols) {
  return Array.from({ length: columnCount }).map((_, idx) => ({
    field: `col${idx}`,
    headerName: idx < fixCols ? `Row` : `Column ${idx}`,
    width: 120,
    editable: true
  }));
}

function generateRows(rowCount, colCount, fixRows, fixCols) {
  return Array.from({ length: rowCount }).map((_, rIdx) => {
    const row = { id: rIdx };
    for (let cIdx = 0; cIdx < colCount; cIdx++) {
      if (rIdx < fixRows) {
        row[`col${cIdx}`] = `Column ${cIdx}`;
      } else if (cIdx < fixCols) {
        row[`col${cIdx}`] = `Row ${rIdx}`;
      } else {
        row[`col${cIdx}`] = `${rIdx * cIdx}`;
      }
    }
    return row;
  });
}

const optionsMenuList = [
  { key: "bEditable", label: "Editable" },
  { key: "bHorzLines", label: "Horizontal Lines" },
  { key: "bVertLines", label: "Vertical Lines" },
  { key: "bListMode", label: "List Mode" },
  { key: "bHeaderSort", label: "Header Sort" },
  { key: "bSingleSelMode", label: "Single Row Select" },
  { key: "bSingleColSelMode", label: "Single Column Select" },
  { key: "bSelectable", label: "Allow Selection" },
  { key: "bAllowColumnResize", label: "Column Resize" },
  { key: "bAllowRowResize", label: "Row Resize" },
  { key: "bItalics", label: "Italics" },
  { key: "bTitleTips", label: "Show Title Tips" },
  { key: "bTrackFocus", label: "Track Focus" },
  { key: "bFrameFocus", label: "Frame Focus" },
  { key: "bVirtualMode", label: "Virtual Mode" },
  { key: "bCallback", label: "Callback" },
  { key: "bVertical", label: "Vertical Header Text" },
  { key: "bExpandUseFixed", label: "Expand Use Fixed" },
  { key: "bRejectEditAttempts", label: "Reject Edit Attempts" },
  { key: "bRejectEditChanges", label: "Reject Edit Changes" },
  { key: "bRow2Col2Hidden", label: "Hide 2nd Row/Column" }
];

function AboutDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="about-dialog-title">
      <DialogTitle id="about-dialog-title">About GridCtrlDemo</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Modern React UI Demo for Grid Control. Original ported from MFC.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OptionsDialog({ open, onClose, options, onToggle }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="options-dialog-title">
      <DialogTitle id="options-dialog-title">Options</DialogTitle>
      <DialogContent dividers>
        <FormGroup>
          {optionsMenuList.map(opt => (
            <FormControlLabel
              key={opt.key}
              control={
                <Switch
                  checked={options[opt.key] ?? false}
                  onChange={() => onToggle(opt.key)}
                  inputProps={{ "aria-label": opt.label }}
                />
              }
              label={opt.label}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function GridCtrlDemo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [traceData, setTraceData] = useState([]);
  const [nRows, setNRows] = useState(20);
  const [nCols, setNCols] = useState(8);
  const [nFixRows, setNFixRows] = useState(1);
  const [nFixCols, setNFixCols] = useState(1);
  const [options, setOptions] = useState({
    bEditable: false,
    bHorzLines: false,
    bVertLines: false,
    bListMode: true,
    bHeaderSort: false,
    bSingleSelMode: true,
    bSingleColSelMode: true,
    bSelectable: false,
    bAllowColumnResize: false,
    bAllowRowResize: false,
    bItalics: false,
    bTitleTips: false,
    bTrackFocus: false,
    bFrameFocus: false,
    bVirtualMode: true,
    bCallback: true,
    bVertical: true,
    bExpandUseFixed: false,
    bRejectEditAttempts: true,
    bRejectEditChanges: true,
    bRow2Col2Hidden: false
  });
  const [gridData, setGridData] = useState(() =>
    generateRows(20, 8, 1, 1)
  );
  const [columns, setColumns] = useState(() =>
    generateColumns(8, 1)
  );
  const [selectionModel, setSelectionModel] = useState([]);
  const [fontStyle, setFontStyle] = useState({});
  const [cellEditState, setCellEditState] = useState({});
  const [showTrace, setShowTrace] = useState(false);
  const traceInputRef = useRef();

  React.useEffect(() => {
    setColumns(generateColumns(nCols, nFixCols));
    setGridData(generateRows(nRows, nCols, nFixRows, nFixCols));
  }, [nCols, nRows, nFixRows, nFixCols]);

  React.useEffect(() => {
    if (options.bItalics) setFontStyle({ fontStyle: "italic" });
    else setFontStyle({});
  }, [options.bItalics]);

  React.useEffect(() => {
    if (options.bTitleTips) {
      enqueueSnackbar("TitleTips enabled", { variant: "info" });
    }
  }, [options.bTitleTips, enqueueSnackbar]);

  const setOption = key =>
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));

  const handleColsChange = e => {
    const val = Math.max(1, Math.min(999, Number(e.target.value)));
    setNCols(val);
  };

  const handleRowsChange = e => {
    const val = Math.max(1, Math.min(999, Number(e.target.value)));
    setNRows(val);
  };

  const handleFixColsChange = e => {
    const val = Math.max(0, Math.min(nCols - 1, Number(e.target.value)));
    setNFixCols(val);
  };

  const handleFixRowsChange = e => {
    const val = Math.max(0, Math.min(nRows - 1, Number(e.target.value)));
    setNFixRows(val);
  };

  const handleGridCellClick = params => {
    traceMsg(`Clicked on row ${params.id}, col ${params.field.replace("col", "")}`);
  };

  const handleGridCellDoubleClick = params => {
    traceMsg(`Double Clicked on row ${params.id}, col ${params.field.replace("col", "")}`);
  };

  const handleGridCellEditStart = params => {
    traceMsg(`Start Edit on row ${params.id}, col ${params.field.replace("col", "")}`);
    if (options.bRejectEditAttempts) {
      enqueueSnackbar("Edit attempt rejected!", { variant: "warning" });
      return false;
    }
    setCellEditState(params);
    return true;
  };

  const handleGridCellEditStop = params => {
    traceMsg(`End Edit on row ${cellEditState.id}, col ${cellEditState.field.replace("col", "")}`);
    if (options.bRejectEditChanges) {
      enqueueSnackbar("Edit change rejected!", { variant: "warning" });
      return false;
    }
    setCellEditState({});
    return true;
  };

  const handleGridSelectionModelChange = ids => {
    setSelectionModel(ids);
    if (ids.length)
      traceMsg(
        `Selection Change: ${ids.length} selected - latest ID ${ids[ids.length - 1]}`
      );
  };

  const traceMsg = msg => {
    setTraceData(t =>
      [...t, `${msg}${msg.endsWith("\n") ? "" : "\n"}`].slice(-200)
    );
    setShowTrace(true);
  };

  const handleClearTrace = () => setTraceData([]);

  const handleInsertRow = () => {
    const idx = selectionModel[0] ?? 0;
    setGridData(data => {
      const newRow = {
        id: data.length,
        ...Object.fromEntries(columns.map(col => [col.field, "Newest Row"]))
      };
      return [
        ...data.slice(0, idx),
        newRow,
        ...data.slice(idx)
      ].map((row, i) => ({ ...row, id: i }));
    });
    setNRows(prev => prev + 1);
    traceMsg("Inserted row");
  };

  const handleDeleteRow = () => {
    const idx = selectionModel[0];
    if (idx == null) return;
    setGridData(data =>
      data.filter(row => row.id !== idx).map((row, i) => ({ ...row, id: i }))
    );
    setNRows(prev => Math.max(1, prev - 1));
    traceMsg("Deleted row");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditCopy = () => {
    if (navigator.clipboard) {
      const str = gridData
        .map(r =>
          columns.map(col => r[col.field]).join("\t")
        )
        .join("\n");
      navigator.clipboard.writeText(str);
      enqueueSnackbar("Grid copied to clipboard", { variant: "success" });
    }
  };

  const handleEditCut = () => {
    handleEditCopy();
    setGridData([]);
    enqueueSnackbar("Grid cut and cleared", { variant: "info" });
    setNRows(0);
  };

  const handleEditPaste = async () => {
    if (navigator.clipboard) {
      const text = await navigator.clipboard.readText();
      const lines = text.trim().split(/\r?\n/);
      const rows = lines.map((line, idx) => {
        const vals = line.split("\t");
        const row = { id: idx };
        columns.forEach((col, cIdx) => {
          row[col.field] = vals[cIdx] ?? "";
        });
        return row;
      });
      setGridData(() => rows);
      setNRows(rows.length);
      enqueueSnackbar("Clipboard pasted to grid", { variant: "success" });
    }
  };

  const handleFill = () => {
    setGridData(generateRows(nRows, nCols, nFixRows, nFixCols));
    traceMsg("Grid filled");
  };

  const handleHide2ndRowCol = () => {
    setOption("bRow2Col2Hidden");
    if (
      !(
        columns.length > 2 &&
        gridData.length > 2
      )
    )
      return;
    setColumns(cols =>
      options.bRow2Col2Hidden
        ? generateColumns(nCols, nFixCols)
        : cols.map((col, i) => (i === 2 ? { ...col, width: 0 } : col))
    );
    setGridData(rows =>
      options.bRow2Col2Hidden
        ? generateRows(nRows, nCols, nFixRows, nFixCols)
        : rows
    );
    traceMsg("Toggled 2nd row/col hiding");
  };

  const toolbar = (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          GridCtrlDemo
        </Typography>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={isMobile ? 1 : 2}
          useFlexGap
        >
          <Button
            variant="outlined"
            onClick={() => setOptionsOpen(true)}
          >
            Options
          </Button>
          <IconButton
            aria-label="Print"
            color="primary"
            onClick={handlePrint}
            size="large"
          >
            <PrintIcon />
          </IconButton>
          <IconButton
            aria-label="About"
            color="primary"
            onClick={() => setAboutOpen(true)}
            size="large"
          >
            <InfoIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );

  const controls = (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: isMobile ? 0.5 : 2 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="start">
          <Grid item xs={6} md={2}>
            <TextField
              variant="outlined"
              label="Columns"
              size="small"
              type="number"
              value={nCols}
              onChange={handleColsChange}
              inputProps={{ min: 1, max: 999 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              variant="outlined"
              label="Rows"
              size="small"
              type="number"
              value={nRows}
              onChange={handleRowsChange}
              inputProps={{ min: 1, max: 999 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              variant="outlined"
              label="Fixed Cols"
              size="small"
              type="number"
              value={nFixCols}
              onChange={handleFixColsChange}
              inputProps={{ min: 0, max: nCols - 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              variant="outlined"
              label="Fixed Rows"
              size="small"
              type="number"
              value={nFixRows}
              onChange={handleFixRowsChange}
              inputProps={{ min: 0, max: nRows - 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md="auto">
            <Button
              variant="contained"
              onClick={handleInsertRow}
              color="success"
              sx={{ mr: 1 }}
              startIcon={<AddIcon />}
            >
              Insert Row
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteRow}
              color="error"
              sx={{ mr: 1 }}
              startIcon={<DeleteIcon />}
              disabled={selectionModel.length === 0}
            >
              Delete Row
            </Button>
            <Button
              variant="contained"
              onClick={handleFill}
              sx={{ mr: 1 }}
            >
              Fill
            </Button>
          </Grid>
          <Grid item xs={12} md="auto">
            <IconButton
              aria-label="Copy"
              color="secondary"
              onClick={handleEditCopy}
              sx={{ mr: 1 }}
            >
              <ContentCopyIcon />
            </IconButton>
            <IconButton
              aria-label="Cut"
              color="secondary"
              onClick={handleEditCut}
              sx={{ mr: 1 }}
            >
              <ContentCutIcon />
            </IconButton>
            <IconButton
              aria-label="Paste"
              color="secondary"
              onClick={handleEditPaste}
              sx={{ mr: 1 }}
            >
              <ContentPasteIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} md="auto">
            <Button
              startIcon={<ClearAllIcon />}
              variant="outlined"
              color="primary"
              sx={{ mr: 1 }}
              onClick={handleClearTrace}
            >
              Clear Trace
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", bgcolor: "#fafbfc" }}>
      {toolbar}
      <Box sx={{ p: isMobile ? 1 : 3, maxWidth: 1200, mx: "auto" }}>
        {controls}
        <Box
          sx={{
            width: "100%",
            height: isMobile ? 360 : 520,
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            background: "#fff"
          }}
        >
          <DataGrid
            rows={gridData}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[10, 20, 50, 100]}
            checkboxSelection={options.bSelectable}
            disableSelectionOnClick={!options.bSelectable}
            disableColumnSelector
            disableDensitySelector
            sortingOrder={[
              options.bHeaderSort ? "asc" : null,
              options.bHeaderSort ? "desc" : null
            ]}
            disableColumnMenu={!options.bAllowColumnResize}
            hideFooterSelectedRowCount
            selectionModel={selectionModel}
            onSelectionModelChange={handleGridSelectionModelChange}
            onCellClick={handleGridCellClick}
            onCellDoubleClick={handleGridCellDoubleClick}
            onCellEditStart={handleGridCellEditStart}
            onCellEditStop={handleGridCellEditStop}
            sx={{
              "& .MuiDataGrid-cell": fontStyle,
              "& .MuiDataGrid-row": options.bHorzLines
                ? { borderBottom: "1px solid #aaa" }
                : {},
              "& .MuiDataGrid-cell": options.bVertLines
                ? { borderRight: "1px solid #ddd" }
                : {}
            }}
          />
        </Box>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Trace Window
            </Typography>
            <TextField
              inputRef={traceInputRef}
              value={traceData.join("")}
              InputProps={{
                readOnly: true,
                inputProps: {
                  "aria-label": "Trace Window",
                  style: { fontFamily: "monospace" }
                }
              }}
              minRows={isMobile ? 2 : 8}
              maxRows={isMobile ? 6 : 16}
              fullWidth
              multiline
              size="small"
              sx={{ my: 1 }}
            />
          </CardContent>
        </Card>
      </Box>
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <OptionsDialog
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        options={options}
        onToggle={key => setOption(key)}
      />
    </Box>
  );
}

export default GridCtrlDemo;