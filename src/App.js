import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Trash, CheckCircle, ArrowRepeat } from 'react-bootstrap-icons';
import axios from 'axios';
import './App.css'; 

class App extends Component {
  state = {
    todos: [],
    task: '',
    filter: 'all',
  };

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    axios.get('http://localhost:5000/api/get').then((response) => {
      this.setState({ todos: response.data });
    });
  };

  handleInputChange = (event) => {
    this.setState({ task: event.target.value });
  };

  handleAddTodo = () => {
    const { task } = this.state;

    if (!task) {
      toast.error('Please fill in all required fields.');
      return;
    }

    axios.post('http://localhost:5000/api/Post', { task }).then(() => {
      this.fetchTodos();
      this.setState({ task: '' });
      toast.success('Task added to My Inbox successfully!');
    });
  };

  handleDeleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/delete/${id}`).then(() => {
      this.fetchTodos();
      toast.success('Task deleted successfully!');
    });
  };

  handleToggleCompleted = (id) => {
    const updatedTodos = this.state.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    this.setState({ todos: updatedTodos });
  };

  handleFilterChange = (filter) => {
    this.setState({ filter });
  };

  getActiveTaskCount = () => {
    return this.state.todos.filter((todo) => !todo.completed).length;
  };

  render() {
    const { todos, task, filter } = this.state;

    const filteredTodos =
      filter === 'completed'
        ? todos.filter((todo) => todo.completed)
        : filter === 'pending'
        ? todos.filter((todo) => !todo.completed)
        : todos;

    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <div className="app-container">
        <h1 className='heading' >Todo Application</h1>
        <ToastContainer position='top-center' />
         <div className='card'>
          <div className="info-section">
          <p className='date'>{formattedDate}</p>
          <p className='active'> {this.getActiveTaskCount()} Active Tasks</p>
        </div>

        <div className="filter-section">
        <button onClick={() => this.handleFilterChange('all')}>All</button>
        <button onClick={() => this.handleFilterChange('pending')}>Incompleted</button>
          <button onClick={() => this.handleFilterChange('completed')}> Completed</button>
          
          
        </div>
       </div>

        

        <div className="input-section">
          <input
            type='text'
            value={task}
            onChange={this.handleInputChange}
            placeholder='Enter Task...'
            required
          />
          <div>
            <button onClick={this.handleAddTodo}>Add Task</button>
          </div>
        </div>

        {filteredTodos.length > 0 ? (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={todo.completed ? 'completed' : 'pending'}
              >
                <div>
                  <p>{todo.task}</p>
                </div>
                <div>
                  <button onClick={() => this.handleDeleteTodo(todo.id)}>
                    <Trash />
                  </button>
                  <button onClick={() => this.handleToggleCompleted(todo.id)}>
                    {todo.completed ? <CheckCircle /> : <ArrowRepeat />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">Please Add Your Task...!!</p>
        )}
      </div>
    );
  }
}

export default App;
