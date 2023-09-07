import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddTodo from './components/AddTodo';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


function App() {
  const [todos, setTodos] = useState([]);

  const columnDefs = [
    { field: 'Title', sortable: true, filter: true, width: 200},
    { field: 'Author', sortable: true, filter: true, width: 200},
    { field: 'Year', sortable: true, filter: true , width: 200},
    { field: 'Isbn', sortable: true, filter: true , width: 200},
    { field: 'Price', sortable: true, filter: true , width: 200},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems();
  }, [])

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setTodos(valueKeys);
  }

  const fetchItems = () => {
    fetch('https://bookstore-5fe09-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }
  const addTodo = (newTodo) => {
    fetch('https://bookstore-5fe09-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newTodo)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const deleteTodo = (id) => {
    fetch(`https://bookstore-5fe09-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddTodo addTodo={addTodo}/>  
      <div id="myGrid" className="ag-theme-material" style={{ height: 500, width:1100 }}>
        <AgGridReact 
          rowData={todos}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;