import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
// import ListItem from '@material-ui/core/ListItem';
import { withStyles } from "@material-ui/core/styles";
import StarsIcon from "@material-ui/icons/Stars";
import Button from '@material-ui/core/Button';
import axios from "axios";
import Cart from "./Cart";
import { Redirect } from 'react-router-dom';
import Home from "./Home";
import CryptoJS from "crypto-js";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Cards from "./cards";
import OrderPlaced from "./OrdersPlaced"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

toast.configure();
const url="http://localhost:2000/productId/"
const style = theme => ({
disp_block:{
    display:"block !important",
},
ratings: {
    display:"inline-block",
    position:"relative",
    marginLeft:"4%",
    color:"white",
    backgroundColor:"#c51433",
    borderRadius:"9.5px",
    fontSize:"15px !important"
  },
  star:{
    display:"inline-block",
    fontSize:"15px",
    marginBlockEnd:"0em",
    
  },
  rate_num:{
    display:"inline-block",
    fontSize:"12px",
  },
  button:{
    color:"white",
    fontSize:"15px",
    backgroundColor:"#3f51b5",
    // "&&&:hover":{
    //     color:"black",
    // }
}
})
class DisplayProduct extends React.Component {
    constructor(props){
        super(props);
        this.state={            
            // key:this.props.prop,
            // key:"",
            items:this.props.items,
            SelectedProduct:{},
            errorMessage:"",
            successMessage:"",
            flag:false,
            goBack:false,
            login:false,
            cartItems:[],
        }
      }
fetchDetails=()=>{
    var key=""
    if(this.props.prop){
        key=this.props.prop
    }
    if(sessionStorage.getItem("prod_id")){
        key=sessionStorage.getItem("prod_id")
    }
        axios.get(url+String(key)).then(response=>{
            this.setState({errorMessage:"",SelectedProduct:response.data,flag:true})
            if(sessionStorage.getItem("email_c")){
                this.getproducts();
            }
            //changed if condition
        }).catch(error=>{
                  if(error.response){
                      this.setState({errorMessage:error.response.data.message,SelectedProduct:{},flag:false})
                  }
                  else{
                      this.setState({errorMessage:"Server Error",SelectedProduct:{},flag:false})
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
                  this.setState({cartItems:response.data})
              }).catch(error=>{
                  if(error.response){
                      this.setState({cartItems:[]})
                  }
                  else{
                      this.setState({cartItems:[]})
                  }
              })	
        }
goCart=()=>{
        if(sessionStorage.getItem("email_c")){
            let obj={};
            let flag=true;
        obj.products=this.state.SelectedProduct;
        obj.quantity=1;
            if(this.state.cartItems.length>0){
                flag=false;
                this.state.cartItems.map((row,i)=>{
                    if(row.products.pId==this.state.SelectedProduct.pId){
                        obj.quantity=row.quantity+1
                        return 
                    }
                })
            }
        const gcode = "~i?[5.g@,7x#Kc>n0093";
        let ciphertext=sessionStorage.getItem("email_c")
        let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
        let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        axios.put("http://localhost:2000/myCart/"+email,obj).then(response=>{
            if(flag){
                var in_cart=Number(sessionStorage.getItem("cart_items"))+1;
                sessionStorage.setItem("cart_items",in_cart)
            }
            if(sessionStorage.getItem("prod_id")){
                sessionStorage.removeItem("prod_id")
            }
            this.setState({errorMessage:"",successMessage:response.data.message,flag:false}) 
            toast("Added to cart successfully")
            
        }).catch(error=>{
                  if(error.response){
                      this.setState({errorMessage:error.response.data.message,successMessage:"",flag:false})
                      toast(this.state.errorMessage)
                  }
                  else{
                      this.setState({errorMessage:"Server Error",successMessage:"",flag:false})
                      toast(this.state.errorMessage)
                  }
              })
        }
        else{
            this.setState({login:true})
        }
    }
    goBack=()=>{
        this.setState({goBack:true})
    }
componentDidMount(){
        this.fetchDetails();
        }
render(){  
        const { classes } = this.props;
        const element=this.state.SelectedProduct;
        // var discounted_price=(element.price)-(element.price*element.pSeller.pDiscount/100)
        if(this.state.login){
            return <Redirect to="/login"/>
        }
        if(this.state.goBack){
              //if redirecting from cart
            if(sessionStorage.getItem("prod_id")){
                sessionStorage.removeItem("prod_id")
                return <Redirect to="/cart" />
            }
            //if redirecting from cards
            if(this.state.items){
                return <Cards products={this.state.items} category={this.props.items[0].pCategory}/>
            }
            if(this.props.prop){
                return <OrderPlaced/>
            }
            
            
           }
        if(this.state.flag){
            return (
            <Box display="flex" flexDirection="row" m={4}  bgcolor="background.paper" style={{ backgroundColor : "#d0d3d6" }}>
                <Grid >
                <img width="600px" height="100%" src={require("../assets/img/"+element.image)} alt="Product Pic" />
                </Grid>
                <Box flexDirection="column" display="flex" style={{marginLeft:"25%"}}>
                    <Typography variant="h6" gutterBottom>{element.pCategory}</Typography>
                    <Typography variant="h6" gutterBottom>{element.pName}</Typography>
                    <Typography variant="body1" gutterBottom style={{paddingTop:"1%",paddingBottom:"1%"}}>Seller:{element.pSeller.s_Id}</Typography>
                    <Typography variant="h6" >Description</Typography>
                    <Typography variant="body2" gutterBottom>{element.pDescription}</Typography>
                    <Typography variant="h6">Specifications</Typography>
                    <Typography variant="body2" gutterBottom >{element.specification}</Typography>
                    <Typography variant="h6" gutterBottom>Ratings
                    <div className={classes.ratings}>&nbsp;
                        <Typography variant="body2" className={classes.rate_num}>
                            {element.pRating}
                        </Typography>
                        <StarsIcon className={classes.star}/>
                    </div>
                    </Typography>
                    <Typography variant="h6" gutterBottom>Price</Typography>
                    <Typography variant="body1" gutterBottom>₹{((element.price)-(element.price*element.pSeller.pDiscount/100)).toFixed(2)}</Typography>
                    <Typography variant="body1" gutterBottom style={{textDecoration:"line-through"}}>₹{(element.price)}</Typography>
                    <Typography variant="body1" gutterBottom style={{color:"green"}}>{element.pSeller.pDiscount*100}% Off + {element.pSeller.pShippingCharges} Shipping charges</Typography>
                    <Typography variant="h6" gutterBottom>Availability</Typography>
                    <Typography variant="body2" gutterBottom>{element.pSeller.pQuantity}</Typography><br/>
                    <div>
                        <Button className={classes.button} style={{backgroundColor:"#3f51b5",}} onClick={this.goCart}><AddShoppingCartIcon/>ADD TO CART</Button>&nbsp;&nbsp;
                        <Button className={classes.button} style={{backgroundColor:"#ec8f0d",}} onClick={this.goBack}>GO BACK</Button>
                    </div>
                </Box>
            </Box>)
           }
           if(this.state.successMessage!==""){
               return <Redirect to="/Cart"/>
            // return <Cart/>
           }
          
           return null;
    }
}

export default withStyles(style)(DisplayProduct);
