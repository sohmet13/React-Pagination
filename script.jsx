﻿const propTypesApp = {
  check: PropTypes.bool.isRequired,
  checkInf: PropTypes.bool.isRequired,
  pageOfItems: PropTypes.array.isRequired,
  data: PropTypes.array,
  currentData: PropTypes.array,
  name: PropTypes.string,
  address: PropTypes.string
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      check: true,
      data: '',
      currentData: '',
      pageOfItems: [],
      checkInf: false
    }
    this.sorted = {id: false, first_name: true, last_name: true, email: true, phone: true};
    this.load = this.load.bind(this);
    this.getData = this.getData.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.search = this.search.bind(this);
    this.sort = this.sort.bind(this);
    this.inf = this.inf.bind(this);
  }
  load(event) {
    this.setState({
      check: false,
      choice: event.target.value
    });
  }
  getData() {
    let url;
    if (this.state.choice==='small') {
      url="https://my.api.mockaroo.com/small_data.json?key=88b60d20"; 
    } else if (this.state.choice==='big') {
      url="https://my.api.mockaroo.com/big_data.json?key=88b60d20";
    } 
    axios.get(url)
      .then(data => {this.setState({ data: data.data, currentData: data.data})});
    }
   onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
  }
  search() {
    let search = document.getElementById("search").value.toLowerCase();
    let filter = (item) => {
      for (let key in item) {
       if ((key==='id' ||key==='first_name' ||key==='last_name' || key==='email' || key==='phone') && item[key].toString().toLowerCase().includes(search)) {
          return item;
       }
      }
    }
   let data = this.state.data.filter(filter) 
    this.setState({
      currentData: (data.length>0) ? data : [{}]
    });
  }
  sort(e) {
    let value = e.target.id || e.target.parentNode.id;
    let isSorted = this.sorted[value];
    let direction = isSorted ? 1 : -1;
    let sort = (a, b) => {
      if (typeof a[value] ==='number' && typeof b[value]==='number') {
        {if (a[value] > b[value]) {return direction}
         if (a[value] < b[value]) {return direction * -1}
         return 0}
      } else {
        {if (a[value].toLowerCase() > b[value].toLowerCase()) {return direction}
         if (a[value].toLowerCase() < b[value].toLowerCase()) {return direction * -1}
         return 0}
      }
    };
    for (let key in this.sorted) {
       this.sorted[key] =true;
    }
    this.sorted[value] = !isSorted;
     /*заимствованный изначальный метод
       http://jsraccoon.ru/react-sort-and-search
    const sorted = [].slice.call(this.state.currentData).sort(sort);*/
    let sorted = this.state.currentData.slice().sort(sort);
    let sortedData = this.state.data.slice().sort(sort);
    this.setState({
      data: sortedData,
      currentData: sorted
   }) 
  }
  inf(e) {
    let value = e.target.parentNode.id;
    let obj = this.state.data[value-1];
    let name = obj.first_name+' '+obj.last_name;
    let address = obj.country+', '+obj.city +', '+ obj.address;
    this.setState({
      checkInf: true,
      name: name,
      address: address
    })
  }
  render() {
    return (
      <main>
        <Head />
        {this.state.check && <ChooseTable load={this.load} />}
        {(!this.state.check && !this.state.data) && <Load getData={this.getData} />}
        {this.state.data &&
          <div id='table'>
            <Search search={this.search}/>
            {this.state.checkInf && <Inf name={this.state.name} address={this.state.address}/>}
            <table>
              <HeadTable sort={this.sort} sortCheck={this.sorted}/>
               {this.state.pageOfItems.map((a) => 
                     <tr onClick={this.inf} id={a.id}>
                       <td className='id' key={a.id}>{a.id}</td>
                       <td key={a.first_name}>{a.first_name}</td>
                       <td key={a.last_name}>{a.last_name}</td>
                       <td key={a.email}>{a.email}</td>
                       <td key={a.phone}>{a.phone}</td>
                     </tr>
                )}
              {console.log(this.state.pageOfItems)}
             </table>
            <Pagination items={this.state.currentData} onChangePage={this.onChangePage}/>
          </div>}
      </main>
    )
  }
}

class Head extends React.Component {
  render() {
    return <h1>React Pagination</h1>
  }
}

class ChooseTable extends React.Component {
  render() {
    return (
      <div id='ChooseTable'>
        <h2>What kind of data do you want to see on this page?</h2>
        <button type='button' onClick={this.props.load} value='big'>Big data</button>
        <button type='button' onClick={this.props.load} value='small'>Small data</button> 
      </div>
    )
  }
}
class Load extends React.Component {
  componentDidMount() {
    this.props.getData();
  }
  render() {
    return(
    <div>
      <p><i className="fa fa-spinner fa-spin fa-3x" aria-hidden="true"></i></p>
    </div>)
  }
}
class Search extends React.Component {
  render() {
    return (
      <div>
        <input placeholder='Search in results' id='search'/>
        <button onClick={this.props.search}>Find</button>
      </div>
    )
  }
}
class HeadTable extends React.Component {
  render() {
    return (
      <tr id='headTable'>
         <th id='id' onClick={this.props.sort}><i className={!this.props.sortCheck.id ? "fa fa-sort-asc": "fa fa-sort-desc"} aria-hidden="true"></i> id</th>
         <th id='first_name' onClick={this.props.sort}><i className={!this.props.sortCheck.first_name ? "fa fa-sort-asc": "fa fa-sort-desc"} aria-hidden="true"></i> First name</th>
         <th id='last_name' onClick={this.props.sort}><i className={!this.props.sortCheck.last_name ? "fa fa-sort-asc": "fa fa-sort-desc"} aria-hidden="true"></i> Last name</th>
         <th id='email' onClick={this.props.sort}><i className={!this.props.sortCheck.email ? "fa fa-sort-asc": "fa fa-sort-desc"} aria-hidden="true"></i> Email</th>
         <th id='phone' onClick={this.props.sort}><i className={!this.props.sortCheck.phone ? "fa fa-sort-asc": "fa fa-sort-desc"} aria-hidden="true"></i> Phone</th>
     </tr>
    )
  }
}
class Inf extends React.Component {
  render() {
    return(
      <div id='inf'>
        <p><b>User:</b> {this.props.name}</p>
        <p><b>Address:</b> {this.props.address}</p>
      </div>
    )
  }
}
App.propTypes = propTypesApp;

//импортный пагинатор
//https://github.com/cornflourblue/react-pagination-example/blob/master/src/components/Pagination.jsx
//http://jasonwatmore.com/post/2017/03/14/react-pagination-example-with-logic-like-google
const propTypes = {
    items: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number
}

const defaultProps = {
    initialPage: 1,
    pageSize: 10
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {} };
    }
    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.items && this.props.items.length) {
            this.setPage(this.props.initialPage);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.items !== prevProps.items) {
            this.setPage(this.props.initialPage);
        }
    }
    setPage(page) {
        var { items, pageSize } = this.props;
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }
        // get new pager object for specified page
        pager = this.getPager(items.length, page, pageSize);
        // get new page of items from items array
        var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
        // update state
        this.setState({ pager: pager });
        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        var pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
            <ul className="pagination">
                {pager.pages.map((page, index) =>
                    <li key={index} className={pager.currentPage === page ? 'active' : ''}>
                        <a onClick={() => this.setPage(page)}>{page}</a>
                    </li>
                )}
                
            </ul>
        );
    }
}
Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

ReactDOM.render(<App/>, document.getElementById("app"));