import React, {useMemo} from 'react';
import { useTable } from 'react-table';
import { Table } from 'react-bootstrap';

function DataTable({ columns, data, onRowClick, onRowDoubleClick }) {
  // Use the state and functions returned from useTable to build your UI
  const visibleColumns = useMemo(
    () =>
      columns.filter((column) => column.show !== false), // Filter out columns with show: false
    [columns]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns: visibleColumns,
    data,
  });

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row.original); // Pass the original data to the parent component
    }
  };

  const handleRowDoubleClick = (row) => {
    if (onRowDoubleClick) {
      onRowDoubleClick(row.original); // Pass the original data to the parent component
    }
  };

  // change
  return (
    <div>
      <Table striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => handleRowClick(row)} onDoubleClick={() => handleRowDoubleClick(row)}>
                {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default DataTable;
