import React, { Component } from "react";
import { Link , Redirect} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from "axios";
import Home from './Home'
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import "react-toastify/dist/ReactToastify.css";

toast.configure();


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

class LoginComponent extends Component {
  state = {
    form: {
      email: '',
      password: ''
    },
    formErrMsg: {
      email: '',
      password: '',
    },
    formValid: {
      email: false,
      password: false,
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
    toast("Successfully logged in!");
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
      case 'email':
        let emailRegex = new RegExp(/^[A-z][A-z0-9.]+@[a-z]+\.[a-z]{2,3}$/);
        value === "" ? message = "Please enter your email id" : emailRegex.test(value) ? message = "" : message = "Email id format is wrong"
        break;

      case "password":
        let passRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$&*%&])(?=.*[0-9])(?=.*[a-z]).{7,20}$/);
        value === "" ? message = "Please enter your password" : passRegex.test(value) ? message = "" : message = "Invalid password"
        break
      default:
        break;
    }
    //Form err message set
    formErrMsg[fieldName] = message;
    this.setState({ formErrMsg: formErrMsg });
    //Form Valid set
    message === "" ? formValid[fieldName] = true : formValid[fieldName] = false;
    formValid.buttonActive = formValid.email && formValid.password;
    this.setState({ formValid: formValid });
  }

  submitSignIn = (e) => {
    e.preventDefault();
    const userLoginData = { uEmail: this.state.form.email, uPass: this.state.form.password };
    axios.post(usersBackendURL + '/login', userLoginData)
      .then(response => this.setState({ successResponse: response.data }))
      .catch(error => {
        this.setState({ errorMessage: error.response ? error.response.data.message : error.message })
      })
  }
  sessionStore=()=>{
    sessionStorage.setItem("user",this.state.successResponse.uProfile.uName)
    sessionStorage.setItem("cart_items",this.state.successResponse.cart.length)
  }  
render() {
    const { email, password } = this.state.form;
    const { formErrMsg } = this.state
    const { classes } = this.props;
    if(this.state.successResponse){
      this.sessionStore();
      this.crypt(this.state.form.email);
      return <Redirect to="/dashboard"/>
    }
    return (
      <React.Fragment>
        <div className="col-md-4 offset-4">
          <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Please login to continue
              </Typography>

              <form id="form" className={classes.form} onSubmit={this.submitSignIn}>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="uemail">Email address</InputLabel>
                  <Input autoComplete="email" autoFocus
                    id="uemail" name="email"
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
                <span className="text-danger">*Mandatory Fields</span>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!this.state.formValid.buttonActive}
                >Login
              </Button>

              </form><br />
              <Link to="/register" exact={"true"} onClick={this.handleClick}>New to Hoopla? Create an account</Link><br />
              {this.state.errorMessage ? (<div className={'text-danger'}>{this.state.errorMessage}</div>) :
                this.state.successResponse && <div className="text-success">Successfully logged in</div>}
            </Paper>
          </main>
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(LoginComponent)
