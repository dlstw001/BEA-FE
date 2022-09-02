//Pagination
import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';

//Data Grid
import { DataGridPro, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid-pro';
import { Box } from '@mui/material';

function CustomPagination({ rowCount }) {
	const apiRef = useGridApiContext();
	const page = useGridSelector(apiRef, gridPageSelector);
	const pageCount = useGridSelector(apiRef, gridPageCountSelector);

	const [displayRowFrom, setDisplayRowFrom] = useState(null);
	const [displayRowTo, setDisplayRowTo] = useState(null);
	const [rowCountDisplay, setRowCountDisplay] = useState(rowCount);

	//MUI Doc Settings
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
				width: '100%',
				display: 'flex',
				justifyContent: 'space-between',
				margin: '0 20px',
			}}
		>
			<div>
				Results {displayRowFrom} - {displayRowTo} of {rowCountDisplay}
			</div>
			<Pagination color='primary' count={pageCount} page={page + 1} onChange={(event, value) => apiRef.current.setPage(value - 1)} />
		</div>
	);
}

export default function TableWithPagination({
	columns,
	rows,
	rowCount,
	page,
	onPageChange,
	sortingMode,
	onSortModelChange,
	rowModesModel,
	onRowEditStart,
	onRowEditStop,
	processRowUpdate,
	onProcessRowUpdateError,
	pagination,
	selectionModel,
	onSelectionModelChange,
	checkboxSelection,
	isRowSelectable,
	disableColumnSelector,
}) {
	return (
		<Box style={{ height: '67vh', width: '100%' }}>
			<DataGridPro
				sx={{
					'.MuiDataGrid-columnHeaders': { backgroundColor: '#FFB81C' },
				}}
				columns={columns}
				rows={rows}
				rowCount={rowCount}
				checkboxSelection={checkboxSelection}
				editMode='row'
				page={page}
				pageSize={10}
				getRowHeight={() => 52}
				getEstimatedRowHeight={() => 50}
				paginationMode='server'
				sortingMode={sortingMode || 'server'}
				onPageChange={onPageChange}
				onSortModelChange={onSortModelChange}
				disableSelectionOnClick={true}
				disableColumnFilter={true}
				disableColumnPinning={true}
				disableColumnSelector={disableColumnSelector || false}
				pagination={pagination}
				selectionModel={selectionModel}
				onSelectionModelChange={onSelectionModelChange}
				rowModesModel={rowModesModel}
				isRowSelectable={isRowSelectable}
				onRowEditStart={onRowEditStart}
				onRowEditStop={onRowEditStop}
				processRowUpdate={processRowUpdate}
				onProcessRowUpdateError={onProcessRowUpdateError}
				components={{
					Pagination: CustomPagination,
					Toolbar: undefined,
				}}
				componentsProps={{
					pagination: { rowCount: rowCount },
				}}
				experimentalFeatures={{ newEditingApi: true }}
			/>
		</Box>
	);
}
