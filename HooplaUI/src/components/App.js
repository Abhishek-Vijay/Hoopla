import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from "./NavBar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import SellerLogin from "./SellerLogin";
import SellerRegister from "./SellerRegister"
import Cards from "./cards"
import Cart from "./Cart.js"
import OrderPlaced from "./OrdersPlaced"
import DisplayProduct from "./DisplayProduct"
import AddProduct from "./AddProduct";
import SellerProducts from "./SellerProducts";
import Search from "./search"
class App extends Component {
  render() {
    return (
      //to put root element properly changes are to be made here
      <div style={{marginTop:"8%"}}>
        <Router>
          <Fragment>
            <Navbar />
            <Switch>
              <Route exact path='/dashboard' component={()=><Home/>} />
              <Route exact path='/register' component={()=><Register/>} />
              <Route exact path='/sellerRegister' component={()=><SellerRegister/>} />
              <Route exact path='/sellerLogin' component={()=><SellerLogin/>} />
              <Route exact path='/card' component={()=> <Cards/>} />
              <Route exact path='/cart' component={()=><Cart/>} />
              <Route exact path='/search' component={()=><Search/>} />
              <Route exact path='/displayProduct' component={()=><DisplayProduct/>} />
              <Route exact path='/orders' component={()=><OrderPlaced/>} />
              <Route exact path='/addProduct' component={()=><AddProduct/>} />
              <Route exact path='/login' component={() => <Login />} />
              <Route path='/sellerProduct' component={()=><SellerProducts/>} />
              <Route path='/' component={()=><Home/>} />
              
            </Switch>
          </Fragment>
        </Router>
      </div>
    );
  }
}

export default App
