import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PersonAddOutLinedIcon from '@material-ui/icons/PersonAddOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from "axios";
import Login from './Login'
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import "react-toastify/dist/ReactToastify.css";

const usersBackendURL = "http://localhost:2000";

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

class RegisterComponent extends Component {
  state = {

    form: { 

      username: '',
      dob: '',
      mobileNumber: '',
      email: '',
      password: '',
      address:''
    },
    formErrMsg: {
      username: '',
      dob: '',
      mobileNumber: '',
      email: '',
      password: '',
      address: '',
    },
    formValid: {
      username: false,
      dob: false,
      mobileNumber: false,
      email: false,
      password: false,
      address: false,
      buttonActive: false
    },
    successResponse: "",
    errorMessage: ""
  }

  crypt=(data) =>{
    const gcode = "~i?[5.g@,7x#Kc>n0093";
  
    // Encrypt
    let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), gcode);
    sessionStorage.setItem("email_c", ciphertext);
    
    // // Decrypt
    // let bytes = CryptoJS.AES.decrypt(ciphertext.toString(), gcode);
    // let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // sessionStorage.setItem("email", decryptedData);
    toast("Successfully Registered!");
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
        case 'username':
        let uRegex = new RegExp(/^[^\s].+[^\s]{1,}$/)
        value === "" ? message = "Please enter your username" : uRegex.test(value) ? message = "" : message = "Should be at least 3 characters long consisting of alphabet and spaces and spaces should not at start or end"
        break;

        case 'mobileNumber':
        let nRegex = new RegExp(/^[1-9]{1}[0-9]{9}$/)
        value === "" ? message = "Please enter your mobile number" : nRegex.test(value) ? message = "" : message = "Mobile number should be 10 digit"
        break;

        case 'dob':
        var todayDate = new Date()
        var dobDate = new Date(value)
        value === "" ? message = "Please enter your Date of Birth" : dobDate <= todayDate ? message = "" : message = "Your DOB cananot be greater than today's date"
        break;

      case 'email':
        let emailRegex = new RegExp(/^[A-z][A-z0-9.]+@[a-z]+\.[a-z]{2,3}$/);
        value === "" ? message = "Please enter your email id" : emailRegex.test(value) ? message = "" : message = "Email id format is wrong"
        break;

      case "password":
        let passRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$&*%&])(?=.*[0-9])(?=.*[a-z]).{7,20}$/);
        value === "" ? message = "Please enter your password" : passRegex.test(value) ? message = "" : message = "Should be 7-20 characters long consisiting of alphabets with at least 1 uppercase , 1 lowercase,1 digits and any of !@#$%&"
        break;

      case 'address':
        let addRegex = new RegExp(/.{10,}/);
        value === "" ? message = "Please enter address" : addRegex.test(value) ? message = "" : message = "Provide proper address of at least 10 characters"
        break;

      default:
        break;
    }
    //Form err message set
    formErrMsg[fieldName] = message;
    this.setState({ formErrMsg: formErrMsg });
    //Form Valid set
    message === "" ? formValid[fieldName] = true : formValid[fieldName] = false;
    formValid.buttonActive = formValid.email && formValid.password && formValid.username && formValid.mobileNumber && formValid.dob && formValid.address;
    this.setState({ formValid: formValid });
  }

  submitRegister = (e) => {
    e.preventDefault();
    // const uCred={email:this.state.form.email,pass:this.state.form.password}
    // const uProf={email:this.state.form.email,pass:this.state.form.password,name: this.state.form.username, dob:this.state.form.dob, phone:this.state.form.mobileNumber,address:this.state.form.address}
    const userRegisterData={email:this.state.form.email,pass:this.state.form.password,name: this.state.form.username, dob:this.state.form.dob, phone:this.state.form.mobileNumber,address:this.state.form.address}
    // const userRegisterData = {uName: this.state.form.username, uDob:this.state.form.dob, uPhone:this.state.form.mobileNumber, uEmail: this.state.form.email, uPass: this.state.form.password };
    axios.post(usersBackendURL + '/register', userRegisterData)
      .then(response => this.setState({ successResponse: response.data }))
      .catch(error => {
        this.setState({ errorMessage: error.response ? error.response.data.message : error.message })
      })
  }

  render() {
    const { username, dob, mobileNumber, email, password, address} = this.state.form;
    const { formErrMsg } = this.state
    const { classes } = this.props;
    if(this.state.successResponse){
      this.crypt(this.state.form.email);
      return <Redirect to="/login"/>
    }

    return (
      <React.Fragment>
        {/* <br></br><br></br> */}
        <div className="col-md-4 offset-4">
          <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <PersonAddOutLinedIcon />
              </Avatar>
              <Typography id="head" component="h1" variant="h5">
                Create account
              </Typography>

              <form className={classes.form} onSubmit={this.submitRegister}>

                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="uName">Username</InputLabel>
                  <Input autoComplete="uName" autoFocus
                    id="uName" name="username"
                    value={username} onChange={this.handleInputChange} />
                  <span className="text-danger">{formErrMsg.username}</span>
                </FormControl>

                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="uDob">DOB</InputLabel><br/><br/>
                  <Input name="dob" type="date" id="uDob" 
                    value={dob} onChange={this.handleInputChange} />
                  <span className="text-danger">{formErrMsg.dob}</span>
                </FormControl>

                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="uMobilenumber">Mobile Number</InputLabel>
                  <Input name="mobileNumber" type="number" id="uMobilenumber" 
                    value={mobileNumber} onChange={this.handleInputChange} />
                  <span className="text-danger">{formErrMsg.mobileNumber}</span>
                </FormControl>


                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="uemail">Email address</InputLabel>
                  <Input name="email" type="email" id="uemail" 
                    value={email} onChange={this.handleInputChange} />
                  <span className="text-danger">{formErrMsg.email}</span>
                </FormControl>

                

                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="uPass">Password</InputLabel>
                  <Input name="password" type="password" value={password}
                    onChange={this.handleInputChange} id="uPass"
                    autoComplete="current-password" />
                  <span className="text-danger">{formErrMsg.password}</span><br />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="selleraddress">Address</InputLabel>
                  <Input 
                    id="selleraddress" name="address"
                    value={address} onChange={this.handleInputChange} />
                  <span className="text-danger">{formErrMsg.address}</span>
                </FormControl>
                <br/>
                <span className="text-danger">*Mandatory Fields</span>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!this.state.formValid.buttonActive}
                >Register
              </Button>

              </form><br />
              <Link to="/login" id="login" exact={"true"} onClick={this.handleClick}>Existing User? Log in</Link><br />
              {this.state.errorMessage ? (<div className={'text-danger'}>{this.state.errorMessage}</div>) :
                this.state.successResponse && <div className="text-success">Successfully logged in</div>}
            </Paper>
          </main>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(RegisterComponent)
