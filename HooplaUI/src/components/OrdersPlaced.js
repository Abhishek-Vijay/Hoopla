import React, { Component } from "react";
import axios from "axios";
import {withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CryptoJS from "crypto-js";
import { Link } from 'react-router-dom';
import DisplayProduct from './DisplayProduct'
import Box from '@material-ui/core/Box';
const styling = theme => ({
    table1: {
        minWidth: 700,
        // width:800,
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
          boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
      },

      container:{
        width:"800px",
        marginLeft:"20%",
        marginTop:"2%",
        position:"relative",
        display: "inline-block",
        // boxShadow:"-6px -4px 1px -1px rgba(0,0,0,0.2)",
      },
      curs:{
        "&:hover":{
          cursor:"pointer",
          color: "blue !important",
          fontWeight: "700",
      
        }
      }
    
  });
class OrderPlaced extends Component{
  constructor(props){
    super(props);
    this.state={
      orders:[],
      prodid:"",
      totalPrice:0,
      rowsPerPage:'',
      page:"",
      called:false,
    }
  }
  getOrder=()=>{
    const gcode = "~i?[5.g@,7x#Kc>n0093";
    let ciphertext=sessionStorage.getItem("email_c")
    let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      axios.get("http://localhost:2000/checkOut/"+email).then(response=>{
              this.setState({errorMessage:"",orders:response.data,called:true})
              
          }).catch(error=>{
              if(error.response){
                  this.setState({errorMessage:error.response.data.message,orders:[],called:true})
              }
              else{
                  this.setState({errorMessage:"Server Error",orders:[],called:true})
              }
          })	
    }
    componentDidMount(){
      this.getOrder()
    }
    customFuntionCall=(pid)=>{
      
      this.setState({prodid:pid})
       
    }

      render(){
        
        const { classes }=this.props;
        const rows=this.state.orders.reverse();
        let all=[1,5,10,50];
        // {rows.map(row => {
        //  return totalPrice+=row.products.price*row.quantity*(1-row.products.pSeller.pDiscount)+row.products.pSeller.pShippingCharges
        // })}
        // this.setState({totalPrice:totalPrice})
        if(this.state.prodid){
          return <DisplayProduct from="orders" prop={this.state.prodid}/>
        }
        return (
          <React.Fragment>
            {(rows.length>0)?(
              // <Box >
                    <TableContainer className={classes.container} component={Paper} elevation={8}>
                    <Table className={classes.table1} aria-label="customized table">
                      <TableHead style={{backgroundColor:"#3f3f7942"}}>
                        <TableRow>
                          <TableCell className={classes.th} align="left"><b>Product Id</b></TableCell>
                          <TableCell className={classes.th} align="left"><b>Product Name</b></TableCell>
                          <TableCell className={classes.th} align="left"><b>Ordered Date</b></TableCell>
                          <TableCell className={classes.th} align="left"><b>Quantity</b></TableCell>
                          <TableCell className={classes.th} align="left"><b>Total Cost</b></TableCell>
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>                        
                        {rows.map((row,i) => {
                         return <TableRow key={i}>
                            <TableCell align="left"><div><a className={classes.curs} onClick={() => {this.customFuntionCall(row.products.pId)}}>
    {row.products.pId}</a></div></TableCell>
                            <TableCell align="left">{row.products.pName}</TableCell>
                            <TableCell align="left">{new Date(row.updatedAt).toDateString()}</TableCell>
                            <TableCell align="left">{row.quantity}</TableCell>
                            <TableCell align="left">{Math.round((row.products.price*row.quantity*(1-row.products.pSeller.pDiscount)+row.products.pSeller.pShippingCharges),2)}</TableCell>
                          </TableRow>
                        })}
                        {/* <TableCell/>
                        <TableCell/>
                        <TableCell/>
                        <TableCell><b>Amount to be paid:</b></TableCell>
                        <TableCell align="right">&#8377;<b>{totalPrice}</b></TableCell> */}
                        {/* {emptyRows>0 && (
                        <TableRow style={{height:80*emptyRows}}>
                        <TableCell/>
                        </TableRow> )} */}
                      </TableBody>
                    </Table>
                    </TableContainer>
                    // </Box>
            ):(this.state.called)?
            <img src={require("../assets/img/noOrders.png")} style={{marginLeft:"30%"}} width="35%" alt="No orders"/>:null}
          </React.Fragment>
        ); 
      }
  }
export default withStyles(styling)(OrderPlaced)
