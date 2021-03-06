import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }

}

class App extends Component {

  constructor () {
    super();
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    
    this.setSearchTopstories    = this.setSearchTopstories.bind(this); 
    this.fetchSearchTopstories  = this.fetchSearchTopstories.bind(this);
    this.onSearchChange         = this.onSearchChange.bind(this);
    this.onDismiss              = this.onDismiss.bind(this);
  }

  componentDidMount() {

    const {searchTerm} = this.state;
    this.fetchSearchTopstories(searchTerm);

  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  onDismiss(id) {

    const updatedList = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState ({
      result: {...this.state.result, hits: updatedList}
    });

  }

  onSearchChange(event) {

    this.setState({searchTerm: event.target.value});

  }

  render() {
    const { searchTerm, result } = this.state;
    if (!result) { return null; }
    return (  
      <div className="page">
        <div className="interactions">
          <Search 
              value={searchTerm}
              onChange={this.onSearchChange}>
            Search
          </Search>
        </div>
        <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}/>
       </div>
    );
  }
}

const Search = ({value, onChange, children}) =>  {
  return (
      <form>
        {children}<input type="text" 
               onChange={onChange}
               value={value}
               />
      </form>  
  );
}

const Table = ({list, pattern, onDismiss}) =>  {

  return (
    <div className="table">
      { list.filter(isSearched(pattern)).map(item => 
          
          <div key={item.objectID} className="table-row"> 
            <span style={{ width: '40%' }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '30%' }}>
              {item.author}
            </span>
            <span style={{ width: '10%' }}>
              {item.num_comments}
            </span>
            <span style={{ width: '10%' }}>
              {item.points}
            </span>
            <span style={{ width: '10%' }}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
              Dismiss
              </Button>
            </span>
          </div> 
      )}

    </div>
  );
}

const Button = ({onClick, className = '', children}) =>  {

  return (
    <button 
      onClick={onClick}
      className={className}
      type='button'
    >
    {children}
    </button>
  );

}

export default App;
