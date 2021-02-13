import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor( props ) {
    super( props );
    this.state = {
      newItem: '',
      list: []
    }
  }

  addItem( toDoVlalue ) {
    if (toDoVlalue !== '') {
      const newItem = {
        id: Date.now(),
        value: toDoVlalue,
        isDone: false,
        timeAdded: String( new Date() )
      };
      // ... means append all the values from current list state to list local var
      const list = [...this.state.list];
      list.push( newItem );

      this.setState({
        list,
        newItem: ''
      });
    }
  }

  deleteItem( id ) {
    const list = [...this.state.list];
    const updatedList = list.filter( item => item.id !== id );

    this.setState({
      list: updatedList
    });
  }

  updateInput( input ) {
    this.setState({
      newItem: input
    });
  }

  checkItem( id, isDone ) {
    const list = [...this.state.list];
    list.forEach(item => {
      if (item.id === id) {
        item.isDone = isDone;
      }
    });

    this.setState({
      list,
      newItem: ''
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <div className="list-group">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Add new</span>
            <input type="text" className="form-control" placeholder="TODO" aria-label="TODO" aria-describedby="basic-addon1" required value={this.state.newItem} onChange={e => this.updateInput(e.target.value)} />
            <button type="button" className="btn btn-outline-info" id="button-addon2" onClick={() => this.addItem(this.state.newItem)} disabled={!this.state.newItem.length} >Insert</button>
          </div>
          </div>
          <div className="list-group">
            {this.state.list.map(item => {
              return(
                <div key={item.id} className="list-group-item list-group-item-action" aria-current="true">
                  <div className="d-flex w-100 justify-content-between">
                    <small className="mb-1" onClick={() => this.deleteItem(item.id)}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></small>
                    <small><input className="form-check-input" type="checkbox" id="checkboxNoLabel" checked={item.isDone} onChange={e => this.checkItem(item.id, e.target.checked)} /></small>
                  </div>
                  <p className="mb-1">{item.value}</p>
                  <small className="fs-6 fw-lighter">{item.timeAdded}</small>
                </div>
              );
            })}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
