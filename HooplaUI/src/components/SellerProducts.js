import React, { Component } from "react";
import {withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {Redirect} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AddProduct from './AddProduct'
import axios from 'axios';
import CryptoJS from "crypto-js";
// import SellerProducts from './SellerProducts'
const url="http://localhost:2000/seller/"


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
      },
    
  });
// const rows=[{ productname: "asus", price: "2500", discount: "5", quantity: "10" }]
class SellerProducts extends Component{
  constructor(props){
    super(props);
    this.state={
      products:[],
      rowsPerPage:'',
      page:"",
      redirect:false
    }
  }
    fetch=()=>{
      const gcode = "~i?[5.g@,7x#Kc>n0093";
    let ciphertext=sessionStorage.getItem("email_s")
    let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      axios.get(url+'products/'+email).then(response=>{
        this.setState({errorMessage:"",products:response.data})              
    }).catch(error=>{
        if(error.response){
            this.setState({errorMessage:error.response.data.message,products:[]})
        }
        else{
            this.setState({errorMessage:"Server Error",products:[]})
        }
    })
    }

  componentDidMount(){
      this.fetch()	
    }
    addproducts=()=>{
      this.setState({redirect:true})
    }
    
  render(){   
    const {classes}=this.props;     
    const rows=this.state.products.reverse();
    if(this.state.redirect){
      // return <AddProduct/>
      //redirection error in console check
      return <Redirect to="/addProduct" />
    }
    return(
        <React.Fragment>
          <div style={{paddingLeft:"15%",marginTop:"5%"}}>
          <Button
                  type="button"                  
                  variant="contained"
                  color="primary"                 
                  onClick={this.addproducts} style={{paddingLeft:"5px"}}
                >&nbsp;ADD PRODUCTS</Button>
          </div>
          {(rows.length>0)?(<div>
      <TableContainer className={classes.container} component={Paper}>
      <Table className={classes.table1} aria-label="customized table">
        <TableHead style={{backgroundColor:"#3f3f7942"}}>
          <TableRow>
            <TableCell className={classes.th} align="left"><b>ProductName</b></TableCell>
            <TableCell className={classes.th} align="left"><b>Price</b></TableCell>
            <TableCell className={classes.th} align="left"><b>Discount</b> </TableCell>
            <TableCell className={classes.th} align="left"><b>Quantity</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,i) => (            
            <TableRow key={i}>
              <TableCell align="left">{row.pName}</TableCell>
              <TableCell align="left">{row.price}</TableCell>
              <TableCell align="left">{row.discount}</TableCell>
              <TableCell align="left">{row.quantity}</TableCell>               
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
      </TableContainer>
      </div>):null}
        </React.Fragment>
      ); 

  }
    }
export default withStyles(styling)(SellerProducts)
