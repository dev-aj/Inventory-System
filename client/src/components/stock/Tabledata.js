import React, { useState, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addItems, deleteItems, viewItems } from '../../actions/stocks';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { Box } from '@material-ui/core';
import Loader from '../layout/Loader';

const columns = [
  { id: 'item_id', label: 'Item ID', align: 'center', minWidth: 170 },
  { id: 'item_name', label: 'Item Name', align: 'center', minWidth: 170 },
  {
    id: 'quantity',
    label: 'Quantity',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'rate',
    label: 'Rate/Pc',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'total',
    label: 'Total Value',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toFixed(2),
  },
];

function createData(item_name, quantity, rate, item_id) {
  const total = parseFloat(quantity) * parseFloat(rate);
  return { item_id, item_name, quantity, rate, total };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const Tabledata = ({ items, addItems, deleteItems, viewItems, stock }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isEditing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [isDeleting, setDeleting] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    rate: '',
  });

  useEffect(() => {
    if (stock.msg) {
      viewItems();
    }
    if (stock.items) {
      items = stock.items;
    }
  }, [viewItems, stock.msg]);

  const { item_name, rate, quantity } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const rows = items.map((item) =>
    createData(item.item_name, item.quantity, item.rate, item.item_id)
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const cancelEditing = () => {
    setDeleteIndex(0);
    setDeleting(false);
    setEditIndex(0);
    setEditing(false);
  };

  const updateIcon = (e, val) => {
    const currentItem = rows.filter((item) => item.item_id === val);
    setFormData({ ...formData, ...currentItem[0] });

    setDeleteIndex(0);
    setDeleting(false);
    setEditIndex(val);
    setEditing(true);
  };

  const deleteIcon = (e, val) => {
    setEditIndex(0);
    setEditing(false);
    setDeleteIndex(val);
    setDeleting(true);

    console.log('Delete id clicked', val);
  };

  const updateData = (val) => {
    addItems(formData, 2);
    cancelEditing();
    console.log('Mesg: ', stock.msg);
    // viewItems();
  };

  const deleteData = (e, val) => {
    deleteItems(val);
    //getItemNames();
    console.log('Delete: ', val);
  };

  return (
    <Fragment>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key='edit' align='center' style={{ minWidth: 170 }}>
                Edit
              </TableCell>
              <TableCell key='delete' align='center' style={{ minWidth: 170 }}>
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          {items === null || stock.items === null || stock.loading ? (
            <Loader />
          ) : (
            <Fragment>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={row.item_id}
                      >
                        {isEditing && editIndex === row.item_id ? (
                          <Fragment>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.id === 'item_id' ? value : ''}
                                  {column.id === 'item_name' ? value : ''}
                                  {column.id === 'quantity' ? (
                                    <TextField
                                      key={column.id}
                                      align={column.align}
                                      value={quantity}
                                      name={column.id}
                                      required
                                      onChange={(e) => onChange(e)}
                                    />
                                  ) : (
                                    ''
                                  )}
                                  {column.id === 'rate' ? (
                                    <TextField
                                      key={column.id}
                                      align={column.align}
                                      value={rate}
                                      name={column.id}
                                      required
                                      onChange={(e) => onChange(e)}
                                    />
                                  ) : (
                                    ''
                                  )}
                                  {column.id === 'total'
                                    ? column.format(value)
                                    : ''}
                                </TableCell>
                              );
                            })}
                            <TableCell key='edit' align='center'>
                              <Box component='span' m={2}>
                                <Tooltip title='Save'>
                                  <DoneIcon
                                    onClick={(e) => updateData(row.item_id)}
                                  />
                                </Tooltip>
                              </Box>
                              <Box component='span' m={2}>
                                <Tooltip title='Cancel'>
                                  <CloseIcon onClick={(e) => cancelEditing()} />
                                </Tooltip>
                              </Box>
                            </TableCell>
                            <TableCell key='delete' align='center'>
                              <Tooltip title='Delete'>
                                <DeleteForeverIcon
                                  onClick={(e) => deleteIcon(e, row.item_id)}
                                />
                              </Tooltip>
                            </TableCell>
                          </Fragment>
                        ) : (
                          <Fragment>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}

                            <TableCell key='edit' align='center'>
                              <Tooltip title='Edit'>
                                <EditIcon
                                  onClick={(e) => updateIcon(e, row.item_id)}
                                />
                              </Tooltip>
                            </TableCell>
                            {isDeleting && deleteIndex === row.item_id ? (
                              <TableCell key='delete' align='center'>
                                <Box component='span' m={1}>
                                  <Tooltip title='Confirm Delete'>
                                    <DoneIcon
                                      onClick={(e) =>
                                        deleteData(e, row.item_id)
                                      }
                                    />
                                  </Tooltip>
                                </Box>
                                <span>{'      '}</span>
                                <Box component='span' m={1}>
                                  <Tooltip title='Cancel'>
                                    <CloseIcon
                                      onClick={(e) => cancelEditing()}
                                    />
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            ) : (
                              <TableCell key='delete' align='center'>
                                <Tooltip title='Delete'>
                                  <DeleteForeverIcon
                                    onClick={(e) => deleteIcon(e, row.item_id)}
                                  />
                                </Tooltip>
                              </TableCell>
                            )}
                          </Fragment>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Fragment>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Fragment>
  );
};

Tabledata.propTypes = {
  addItems: PropTypes.func.isRequired,
  deleteItems: PropTypes.func.isRequired,
  viewItems: PropTypes.func.isRequired,
  stock: PropTypes.object,
};

const mapStateToProps = (state) => ({
  stock: state.stock,
});

export default connect(mapStateToProps, { deleteItems, addItems, viewItems })(
  Tabledata
);
