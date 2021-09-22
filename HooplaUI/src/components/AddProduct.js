import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonAddOutLinedIcon from '@material-ui/icons/PersonAddOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from "axios";
import SellerProducts from './SellerProducts';
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Redirect} from 'react-router-dom';
// import { MenuItem } from "@material-ui/core";
// import Select from '@material-ui/core/Select'
toast.configure();
const usersBackendURL = "http://localhost:2000/seller/products/";

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

class AddProductComponent extends Component {
  constructor(props){
  super(props);//email in props
  this.state = {
    form: { 
      product:'',     
      price: '',
      noofproducts: '',
      discount: '',
      description:''
    },
    formErrMsg: {
      product: '',
     
      price: '',
      noofproducts: '',
      discount: ''
      
    },
    formValid: {
     
      product: false,
      price: false,
      noofproducts: false,
      discount: false,
      buttonActive: false
    },
    successResponse: "",
    errorMessage: "",
    // email:this.props.email,
    items:[],
    flag:false
  
  }
}


  handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ form: { ...this.state.form, [name]: value } });
    this.validateField(name, value);
  }

  validateField = (fieldName, value) => {
    var message;
    var { formErrMsg } = this.state;
    var { formValid } = this.state;

    switch (fieldName) {
        case 'product':
        value === "" ? message = "Please enter your product for sell" :  message = ""
        break;
       case 'category':
       value === "" ? message = "Please select your category to sell" :  message = ""
        break;
        case 'price':
        value === "" ? message = "Please enter the price for selling the product" : message = ""
        break;

        case 'noofproducts':
        value === "" ? message = "Please enter the number of product" :  message = "" 
        break;

      case 'discount':
        value === "" ? message = "Please enter discount in percentage (if any) " :  message = "" 
        break;

      
      default:
        break;
    }
    //Form err message set
    formErrMsg[fieldName] = message;
    this.setState({ formErrMsg: formErrMsg });
    //Form Valid set
    message === "" ? formValid[fieldName] = true : formValid[fieldName] = false;
    formValid.buttonActive = formValid.product && formValid.price && formValid.noofproducts && formValid.discount;
    this.setState({ formValid: formValid });
  }

  submitRegister = (e) => {
    var x;
    e.preventDefault();
    var userprodData = {"name":this.state.form.product,"price":this.state.form.price,"description":this.state.form.description,"quantity":this.state.form.noofproducts,"discount":this.state.form.discount};
    if(this.state.items.length>0){
      this.state.items.map(obj=>{
        if(obj.pName==this.state.form.product){
          x=Number(obj.quantity)+Number(userprodData.quantity);
          userprodData.quantity=x;
        }
    })
  }
  const gcode = "~i?[5.g@,7x#Kc>n0093";
    let ciphertext=sessionStorage.getItem("email_s")
    let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    axios.put(usersBackendURL + email,userprodData)
      .then(response => {this.setState({ successResponse: response.data })
      toast("Successfully added product!");
    })

      .catch(error => {
        // console.log("in error")
        this.setState({ errorMessage: error.response ? error.response.data.message : error.message })
      })
  }
  fetchDetails=()=>{
    const gcode = "~i?[5.g@,7x#Kc>n0093";
    let ciphertext=sessionStorage.getItem("email_s")
    let bytes=CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    let email=JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    axios.get(usersBackendURL+email).then(response=>{
      this.setState({items:response.data})
    }).catch(error=>{
        this.setState({ errorMessage: error.response ? error.response.data.message : error.message })
      })    
  }
  componentDidMount(){
      this.fetchDetails();
    }

  render() {
    const { product, price, noofproducts, discount,description} = this.state.form;
    const { formErrMsg } = this.state
    const { classes } = this.props;
    if(this.state.successResponse){
      return <Redirect to="/sellerProduct" />
    }
    
    return (
      <React.Fragment>
        <div className="col-md-4 offset-4">
          <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <PersonAddOutLinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Wanna add product to sell!
              </Typography>

              <form className={classes.form} onSubmit={this.submitRegister}>

                <FormControl margin="normal" required fullWidth>
                 
                <InputLabel htmlFor="">Product Name</InputLabel>
                  <Input autoComplete="" autoFocus
                    id="" name="product" value={product} onChange={this.handleInputChange}                     />
                  <span className="text-danger">{formErrMsg.product}</span>
                    
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="">At what price you want to sell?(per unit)</InputLabel><br/><br/>
                  <Input name="price" type="number" id=""
                  value={price} onChange={this.handleInputChange}/>
                  <span className="text-danger">{formErrMsg.price}</span>
                  
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                 
                <InputLabel htmlFor="">Description</InputLabel>
                  <Input autoComplete=""
                    id="" name="description" value={description} onChange={this.handleInputChange} />                
                    
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="">How many products you want to sell?</InputLabel>
                  <Input name="noofproducts" type="number" id="" value={noofproducts} onChange={this.handleInputChange}/>
                  <span className="text-danger">{formErrMsg.noofproducts}</span>
                </FormControl>


                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="">Any discount you want to offer?(in percentage)</InputLabel>
                  <Input name="discount" type="number" id="" value={discount} onChange={this.handleInputChange}  />
                  <span className="text-danger">{formErrMsg.discount}</span>
                </FormControl>
                <span className="text-danger">*Mandatory Fields</span>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!this.state.formValid.buttonActive}
                 >ADD PRODUCT
               </Button>

              </form><br />            
              {this.state.errorMessage ? (<div className={'text-danger'}>{this.state.errorMessage}</div>) :
                this.state.successResponse && <div className="text-success">Successfully added product</div>}
            </Paper>
          </main>
        </div>
      </React.Fragment>
    )
                
  }
}

export default withStyles(styles)(AddProductComponent)
