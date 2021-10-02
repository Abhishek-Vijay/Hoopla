import React, { Component } from "react";
import axios from "axios";
import {withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from '@material-ui/core/Input';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
// import FormControl from '@material-ui/core/FormControl';
// import Cart from './Cart';
import Paper from "@material-ui/core/Paper";
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CryptoJS from "crypto-js";
import DisplayProduct from './DisplayProduct'
// import Form from '@material-ui/core/'
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
toast.configure();

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
        width:"230px",
        // textAlign:"center",
        "&&&:hover":{
            color:"black",
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
        width: "300px",
        position: "relative",
        display: "inline-block",
        marginLeft: "8%",
      },
      curs:{
        "&:hover":{
          cursor:"pointer",
          color: "blue !important",
          fontWeight: "600",
      
        }
      },
  });

class CartComp extends Component{
    constructor(props){
        super(props)
        this.state={
            quantity:this.props.prod.quantity,
            obj:this.props.prod.products,
            toCart: false,
            pid:""
        }
    }
    handleChange = (event) => {
        // invoked whenever any change happen in input fields
        // and update form state with value. Should also invoke validate field
        // var inputfield = event.target.name;
        var enteredvalue = event.target.value;
        if(enteredvalue>0){
          this.setState({quantity:enteredvalue})
        }
        else{
          this.setState({quantity:1})
        }
    };

    handleSubmit=()=>{
        let myObj = {quantity:this.state.quantity, products:this.state.obj}
        const gcode = "~i?[5.g@,7x#Kc>n0093";
        let ciphertext=sessionStorage.getItem("email_c")
        let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
        let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          axios.put("http://localhost:2000/myCart/"+ email,myObj).then(res=>{
            this.setState({errorMessage:"",cartItems:res.data})
          }).catch(error=>{
            if(error.response){
                this.setState({errorMessage:error.response.data.message,cartItems:[],successMessage:""})
            }
            else{
                this.setState({errorMessage:"Server Error",cartItems:[],successMessage:""})
            }
        })	
      }; 
      customFuntionCall=(prodid)=>{
        sessionStorage.setItem("prod_id",prodid)
        // this.setState({pid:prodid})
        window.location.href="http://localhost:3000/displayProduct"
      }

    deleteProduct=()=>{
        const gcode = "~i?[5.g@,7x#Kc>n0093";
    let ciphertext=sessionStorage.getItem("email_c")
    let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        axios.put("http://localhost:2000/myCart/delete/"+ email,this.props.prod).then(response=>{
          this.setState({successMessage:"product deleted from cart",toCart:true})
          // toast(this.state.successMessage)
          var in_cart=Number(sessionStorage.getItem("cart_items"))-1;
          sessionStorage.setItem("cart_items",in_cart)
        }).catch(error=>{
          if(error.response){
              this.setState({errorMessage:error.response.data.message,successMessage:""})
          }
          else{
              this.setState({errorMessage:"Server Error",successMessage:""})
          }
      })
      };
    render(){
      const {classes}=this.props;
      // if(this.state.pid){
      //   //page reload issue
      //   window.location.href="http://localhost:3000/displayProduct"
      //   // return <DisplayProduct prop={this.state.pid}/>
      //   return null
      //   // return <Redirect to="/displayProduct"/>
      // }
      if(this.state.toCart){
        // toast(this.state.successMessage)
            window.location.href="http://localhost:3000/cart";
            return null
            // return <Redirect to="/cart"/>
        }
        // {total_sum = total_sum + (1-row.products.pSeller.pDiscount)*row.products.price}
        return <React.Fragment>
            {/* <Table> */}
                {/* <TableBody> */}
                    <TableRow key={this.props.prod.products.pId}>
                    <TableCell align="left"><a className={classes.curs} onClick={() => {this.customFuntionCall(this.props.prod.products.pId)}}>
    {this.props.prod.products.pName}</a></TableCell>
    {/* <TableCell align="left"><div>{this.props.prod.products.pName}</div></TableCell> */}
                   <TableCell align="left"><form onSubmit={this.handleSubmit}><Input min="0" type="number" id="qty" name="qty"
                          value={this.state.quantity} placeholder="Quantity" onChange={this.handleChange}/></form></TableCell>
                     <TableCell align="left">{((1-this.props.prod.products.pSeller.pDiscount)*this.props.prod.products.price).toFixed(2)}</TableCell>
                     <TableCell align="left">{this.props.prod.products.pSeller.pQuantity}</TableCell>
                    <TableCell align="left" ><Button onClick={this.deleteProduct}><DeleteIcon/></Button></TableCell>
                   </TableRow>
                {/* </TableBody> */}
            {/* </Table> */}
        </React.Fragment>
    }
}

export default withStyles(styling)(CartComp)
