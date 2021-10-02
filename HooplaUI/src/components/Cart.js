import React, { Component } from "react";
import axios from "axios"
import {withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import CartComp from './CartComp.js';
import { Redirect } from 'react-router-dom';
import CryptoJS from "crypto-js";
import Typography from "@material-ui/core/Typography";
const styling = theme => ({
    table1: {
        minWidth: 700,
        // width:800,
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
          boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
      },
      table2:{
        width: 300,
        // width:800,
        // boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
          boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
        },
        // margin:"5px"
      },
      th:{
          fontWeight:700,
      },
      button:{
        color:"white",
        fontSize:"15px",
        backgroundColor:"#3f51b5",
        position:"relative",
        // marginRight:"5%",
        width:"100%",
        // textAlign:"center",
        "&&&:hover":{
            // color:"black",
            backgroundColor:"#3f51b5",
            // fontSize:"18px"
        }
      },
      container:{
        width:"800px",
        marginLeft:"2%",
        position:"relative",
        display: "inline-block",
      },
      container2:{
        width: "330px",
        position: "relative",
        display: "inline-block",
        marginLeft: "8%",
      }
  });
  // const rows = [
  //   { item: "aa", qty: "12", discount: "2343", products_in_stock: "34" },
  //   { item: "aa2", qty: "122", discount: "22343", products_in_stock: "34" }
  // ];
  var total_sum=0;
  // var total_tax=0;
class Cart extends Component{
  constructor(props){
    super(props);
    this.state={
      cartItems:[],
      errorMessage : "",
      successMessage: "",
      // quantity : 1,
      // myObj : null
      order: false,
      called:false
    }
  }
  orderProducts(){
    const gcode = "~i?[5.g@,7x#Kc>n0093";
    let ciphertext=sessionStorage.getItem("email_c")
    let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    axios.put("http://localhost:2000/checkOut/"+ email).then(res=>{
      this.setState({errorMessage:"",cartItems:[],order:true})
      // axios.get("http://localhost:2000/checkOut/"+ "johnnybhaiya@gmail.com").then(response=>{
      //   this.setState({successMessage:"Redirecting to ordered placed!!"})
      // })
    }).catch(error=>{
      if(error.response){
          this.setState({errorMessage:error.response.data.message})
      }
      else{
          this.setState({errorMessage:"Server Error"})
      }
  })
  }
  getproducts(){
    const gcode = "~i?[5.g@,7x#Kc>n0093";
    let ciphertext=sessionStorage.getItem("email_c")
    let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    this.setState({errorMessage:"",cartItems:[],successMessage:""});
      axios.get("http://localhost:2000/myCart/"+email).then(response=>{
        sessionStorage.setItem("cart_items",response.data.length)
              this.setState({errorMessage:"",cartItems:response.data, quantity:response.data.quantity,successMessage:"",called:true})
          }).catch(error=>{
              if(error.response){
                  this.setState({errorMessage:error.response.data.message,cartItems:[],successMessage:"",called:true})
              }
              else{
                  this.setState({errorMessage:"Server Error",cartItems:[],successMessage:"",called:true})
              }
          })	
    }

  //   handleChange = (event) => {
  //     // invoked whenever any change happen in input fields
  //     // and update form state with value. Should also invoke validate field
  //     // var inputfield = event.target.name;
  //     var enteredvalue = event.target.value;
  //     this.setState({quantity:enteredvalue})
  //     // this.validateField(inputfield, event.target.value);
  // };
  // handleSubmit=()=>{
  //   if(this.state.myObj!=null){
  //     axios.put("http://localhost:2000/myCart/"+ "johnnybhaiya@gmail.com",this.state.myObj).then(res=>{
  //       this.setState({errorMessage:"",cartItems:res.data})
  //     }).catch(error=>{
  //       if(error.response){
  //           this.setState({errorMessage:error.response.data.message,cartItems:[],successMessage:""})
  //       }
  //       else{
  //           this.setState({errorMessage:"Server Error",cartItems:[],successMessage:""})
  //       }
  //   })	}
  // } 

  // deleteProduct=(prod)=>{
  //   console.log("in delete")
  //   console.log(prod)
  //   axios.put("http://localhost:2000/myCart/delete"+ "johnnybhaiya@gmail.com",prod).then(response=>{
  //     console.log(response)
  //     this.setState({successMessage:"product deleted from cart"})
  //     console.log("after axios")
  //   }).catch(error=>{
  //     if(error.response){
  //         this.setState({errorMessage:error.response.data.message,successMessage:""})
  //     }
  //     else{
  //         this.setState({errorMessage:"Server Error",successMessage:""})
  //     }
  // })
  // }

    componentDidMount(){
      if(sessionStorage.getItem("email_c"))
     { this.getproducts()}
     else{
       return <Redirect to="/login"/>
     }
    }
    componentDidUpdate(prevProps, prevState){
      if(this.state.cartItems.length != prevState.cartItems.length){
        sessionStorage.setItem("cart_items",this.state.cartItems.length)
      }
    }
  render(){
    const {classes}=this.props;
    const rows=this.state.cartItems;
    // console.log(rows)
    total_sum=0;
    if(rows.length>0||this.state.successMessage!=""){
      if(this.state.successMessage!=""){
        this.getproducts()
      }
      // console.log("in reRender")
      return(
      <React.Fragment>
        <Typography variant="h5" style={{marginLeft:"4%",color:"#aa46c3"}}>
          You have {rows.length} items in cart
        </Typography>
          <TableContainer className={classes.container} component={Paper} elevation={8}>
            <Table className={classes.table1} aria-label="customized table">
              <TableHead >
                <TableRow>
                  <TableCell className={classes.th} align="left">Item</TableCell>
                  <TableCell className={classes.th} align="left">Qty in cart</TableCell>
                  <TableCell className={classes.th} align="left">Discounted Price</TableCell>
                  <TableCell className={classes.th} align="left">Products left in stock</TableCell>
                  <TableCell className={classes.th} align="left">Remove From Cart</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {total_sum=0}
                {total_tax=0} */}
                {rows.map((row,i) => { 
                  {total_sum = total_sum + (1-row.products.pSeller.pDiscount)*row.products.price*row.quantity}
                  return <CartComp prod={row} key={i}></CartComp>
                  // this.setState({quantity:1})
                  // return (<TableRow key={row.products.pId}>
                  //   <TableCell align="left">{row.products.pName}</TableCell>
                  //   <TableCell align="left"><FormControl onSubmit={()=>{this.setState({myObj:row});return   this.handleSubmit}}><Input type="number" id="qty" name="qty"
                  //         value={this.state.quantity} placeholder="Quantity" onChange={this.handleChange}/></FormControl></TableCell>
                  //   <TableCell align="left">{(1-row.products.pSeller.pDiscount)*row.products.price}</TableCell>
                  //   <TableCell align="left">{row.products.pSeller.pQuantity}</TableCell>
                  //   <TableCell align="left" ><Button onClick={()=>this.deleteProduct(row)}><DeleteIcon/></Button></TableCell>
                  // </TableRow>
                  // )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer className={classes.container2} component={Paper} elevation={8} style={{position:"fixed"}}>
          <Table className={classes.table2} aria-label="customized table" >
            <TableHead style={{fontSize:"22px",fontWeight:"550"}}>
            <TableRow>
            <TableCell style={{fontSize:"20px",fontWeight:"550"}}>Price details</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="left" className={classes.th}>Cart total(MRP):</TableCell>
                <TableCell align="left">{total_sum.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" className={classes.th}>Total Tax:</TableCell>
                <TableCell align="left">{(0.17*total_sum).toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" className={classes.th}>Total amount payable:</TableCell>
                <TableCell align="left">{(1.17*total_sum).toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
            {/* <TableRow  colSpan={2}> */}
              {/* <div>
              <Button className={classes.button} onClick= {()=>this.orderProducts()}>CHECKOUT</Button>
                </div> */}
            {/* </TableRow> */}
          </Table>
          <div>
              <Button className={classes.button} onClick= {()=>this.orderProducts()}>CHECKOUT</Button>
                </div>
          </TableContainer>
            
                
          </React.Fragment>

          )}
          else if(this.state.order){
            return <Redirect to="/orders"/>
            // window.location.href="http://localhost:3000/cart";
            // return null
          }
          else if(this.state.called)
            return <img src={require("../assets/img/cartEmpty.png")} style={{marginLeft:"30%",marginTop:"10%"}} width="35%" alt="No orders"/>
          else 
            return null
  }
  }
export default withStyles(styling)(Cart)
