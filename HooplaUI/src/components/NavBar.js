import React, { Component } from 'react';
import { Link,Redirect } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import withStyles from '@material-ui/core/styles/withStyles';
// import { createMuiTheme } from '@material-ui/core/styles';
// import indigo from '@material-ui/core/colors/indigo';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Home from './Home'
import Card from "./cards"
import { IconButton } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
//icons to be added
import PersonAddIcon from '@material-ui/icons/PersonAdd'; //registration
import LockIcon from '@material-ui/icons/Lock'; //before login 
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'; //cart
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial'; //orders places
import ExitToAppIcon from '@material-ui/icons/ExitToApp'; //logout
import axios from 'axios';
// import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { InputBase } from '@material-ui/core';
import Search from "./search";
const styles = theme => ({
  input:{
    marginLeft: theme.spacing(4),
    color:"#ffff",
    backgroundColor: "#6271c3",
    borderRadius: "4px",
    "&&&:before": {
      borderBottom: "none"
    },
    "&&:after": {
      borderBottom: "none"
    }
  },
  search:{
    color:"#ffffff",
    paddingLeft:"5px",
    // paddingRight:"25px",
    marginRight:'auto'
  },
  icons:{      
    marginLeft:"0",
    paddingLeft:"50%"
    
  },
  // ico:{      
  //   // marginLeft:"0",
  //   paddingLeft:"50px",
  //   position:"relative"
  // },
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
  link:{
    "&:hover": {
      // textColor:"#f50057",
      backgroundColor: "#f50057" ,
      color:"white" ,
      border: "1px #f50057",
      borderRadius:"4px"
    }
  }
});
const hoveredStyle ={
  cursor : "initial"
}
class NavBar extends Component {
  constructor(props){
    super(props);
    this.state={
      keyword:"",
      // products:[],
      search:"",
      home:false,
    }
  }

handleChange=(event)=>{
    let myvalue = event.target.value
    this.setState({keyword:myvalue})
}

handleSubmit=(event)=>{
//   if(this.state.keyword!=""){
//   axios.get("http://localhost:2000/prodSearch/"+this.state.keyword).then(response=>{
//         this.setState({products:response.data})
//   }).catch(error=>{
//     if(error.response){
//         this.setState({errorMessage:error.response.data.message,cartItems:[],successMessage:""})
//     }
//     else{
//         this.setState({errorMessage:"Server Error",cartItems:[],successMessage:""})
//     }
// })	
// }
if(this.state.keyword!=""){
  this.setState({search:true})
}
event.preventDefault();
}
home=()=>{
 this.setState({home:true})
}
// category=(x)=>{
//   this.setState({redirect:true,category:x})
//   // return <Card category={x}/>
// }
  render() {
    const { classes } = this.props;
    const userName=sessionStorage.getItem("user")
    var cart=0;
    var val=sessionStorage.getItem("cart_items");
    if(val){
      cart=val
    }
    // this.state.products.length>0
    if(this.state.search){
      //////redirection issue
      // return <Card products={this.state.products}/>
      sessionStorage.setItem("search_key", this.state.keyword)
      window.location.href="http://localhost:3000/search"
    }
    if(this.state.home){
      return <Redirect to="/home" />
    }
    // if(this.state.redirect){
    //   return <Card category={this.state.category}/>
    // }
    return (
      <React.Fragment>
        <AppBar position="fixed">
          <Toolbar>
          <Box display="flex" flexDirection="row" p={1} m={1}>
            <Box>
            <Tooltip title="Home" placement="bottom">
              <Typography className={classes.title} variant="h6" noWrap>
                <a href="/" exact={"true"} color="inherit" onClick={window.location.reload}><img src={require("../assets/img/hoopla.png")} height="30px" width="90px" alt="Home"></img></a>
              </Typography>
            </Tooltip>
            </Box>
            <Box >
            <div className={classes.search}>
            {/* <div className={classes.searchIcon}><SearchIcon /></div> */}
            <form onSubmit={(event)=>this.handleSubmit(event)} width="20px">
            <InputBase style={{width:"150px"}} onChange={this.handleChange} placeholder="  Search…" value={this.state.searchValue}
             className={classes.input} inputProps={{ 'aria-label': 'search' }}/>
            </form>  
          </div>
            </Box>
          </Box>

            {userName? 
             <div className={classes.icons}>
              <Box display="flex" flexDirection="row-reverse" p={1} m={1}>
                <Box>
                <Tooltip title="Cart" placement="bottom">
                      <Link className="ml-auto" to="/dashboard">
                      <IconButton style={{color:"#ffffff"}} onClick={()=>{sessionStorage.removeItem("user");sessionStorage.removeItem("email_c");sessionStorage.removeItem("email_s");sessionStorage.removeItem("user_s");}}><ExitToAppIcon/></IconButton>
                      </Link>
                      </Tooltip>
                </Box>
                <Box>
                <Tooltip title="Orders Placed" placement="bottom">
                      <Link  className="ml-auto" to="/orders" >
                      <IconButton  style={{color:"#ffffff"}}><FolderSpecialIcon/></IconButton>
                      </Link>
                      </Tooltip>
                </Box>
                <Box p={0.25}>
                <Tooltip title="Cart" placement="bottom">
                      <Link  className="ml-auto"to="/cart"  >
                      <IconButton style={{color:"#ffffff"}}><Badge  color="secondary" showZero badgeContent={cart}><ShoppingCartIcon/></Badge></IconButton>
                      {/* <IconButton style={{color:"#ffffff"}}><ShoppingCartIcon/></IconButton> */}
                      </Link>
                      </Tooltip> 
                </Box>
                <Box p={0.25}>
                {(sessionStorage.getItem("user_s"))?
               (<Tooltip title="Seller Profile" placement="bottom">
               <Link  className="ml-auto"to="/sellerProduct">
               <IconButton  style={{color:"#ffffff"}}><AccountCircleIcon/></IconButton>
               </Link>
             </Tooltip>):(<Tooltip title="Seller login" placement="bottom">
                <Link  className="ml-auto"to="/sellerLogin">
                  <Typography style={{color:"#ffffff",fontSize:"13px"}}>SELLER LOGIN</Typography>
                </Link>
              </Tooltip>)
            } 
                </Box>
                <Box p={1.5} >        
                <Typography className={classes.title} variant="body1" noWrap>Welcome {userName}!</Typography>
                </Box>
            </Box>
            </div>: <div style={{paddingLeft:"50%"}}>
            <Box  className="ml-auto" display="flex" flexDirection="row-reverse" p={1} m={1}>
              <Box>
              <Tooltip title="Register" placement="bottom">
            <Link to='/register' style={{color:"white"}}> <IconButton color="inherit"> 
            <PersonAddIcon />
            </IconButton>
            </Link>
            </Tooltip>
              </Box>
              <Box>
              <Tooltip title="Sign In" placement="bottom">
            <Link to='/login' style={{color:"white"}}> <IconButton color="inherit" > 
            <LockIcon />
            </IconButton>
            </Link>
            </Tooltip>
              </Box>
            </Box>
            </div>}
          </Toolbar>
          {/* <Toolbar style={{height:"40px !important"}}>
              <div style={{textDecoration:"none"}} to="#"><a className={classes.link} onClick={()=>{this.category("Electronics")}} style={{color:"white",fontSize:"20px"}}>ELECTRONICS</a></div>
              <div style={{textDecoration:"none"}} className="ml-auto" to="#" ><a className={classes.link} onClick={()=>{this.category("Shoes")}} style={{color:"white",fontSize:"20px"}}>SHOES</a></div>
              <div style={{textDecoration:"none"}} className="ml-auto" to="#"><a className={classes.link} onClick={()=>{this.category("Furniture")}} style={{color:"white",fontSize:"20px"}}>FURNITURE</a></div>
              <div style={{textDecoration:"none"}} className="ml-auto" to="#"><a  className={classes.link} onClick={()=>{this.category("Clothing")}} style={{color:"white",fontSize:"20px"}}>CLOTHING</a></div>
          </Toolbar> */}
        </AppBar>
        
      </React.Fragment>
    );
  }
}

export default  withStyles(styles)(NavBar)



//getting email from session storage
        // const gcode = "~i?[5.g@,7x#Kc>n0093";
        // let ciphertext=sessionStorage.getItem("email_c")
        // let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
        // let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          {/* <Typography className={classes.title} variant="body1" noWrap>Welcome {userName}!</Typography>
    
             <Tooltip title="Cart" placement="bottom">
              <Link  className="ml-auto" className={classes.ico}  to="/cart"  >
              <IconButton style={{color:"#ffffff"}}><Badge  color="secondary"  showZero badgeContent={cart}><ShoppingCartIcon/></Badge></IconButton>
              </Link>
              </Tooltip> 
              <Tooltip title="Orders Placed" placement="bottom">
              <Link  className="ml-auto" className={classes.ico} to="/orders" >
              <IconButton  style={{color:"#ffffff"}}><FolderSpecialIcon/></IconButton>
              </Link>
              </Tooltip>
              <Tooltip title="Cart" placement="bottom">
              <Link className="ml-auto"  className={classes.ico} to="/dashboard">
              <IconButton style={{color:"#ffffff"}} onClick={()=>{sessionStorage.removeItem("user");sessionStorage.removeItem("email_c")}}><ExitToAppIcon/></IconButton>
              </Link>
              </Tooltip> */}
