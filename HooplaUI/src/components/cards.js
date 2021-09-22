import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from '@material-ui/core/Box';
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';
import CardActionArea from "@material-ui/core/CardActionArea"
import StarsIcon from "@material-ui/icons/Stars"
import DisplayProduct from "./DisplayProduct";
import {Redirect} from 'react-router-dom';
import axios from "axios";

const url ="http://localhost:2000/product/";
const styles = muiBaseTheme => ({
  card: {
    maxWidth: 300,
    margin: "auto",
    transition: "0.1s",
    boxShadow: "0px 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "6px 16px 70px -12.35px rgba(0,0,0,0.3)"
    }
  },
  media: {
    paddingTop: "56.25%"
  },
  content: {
    textAlign: "left",
    padding: muiBaseTheme.spacing.unit * 3,
    height:"100px",
  },
  heading: {
      display:"inline-block",
      position:"relative",
    // fontWeight: "bold"
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif"
  },
  ratings: {
    display:"inline-block",
    position:"relative",
    marginLeft:"73%",
    color:"white",
    backgroundColor:"#c51433",
    borderRadius:"20px"
  },
  star:{
    display:"inline-block",
    fontSize:"14px",
    marginBlockEnd:"0.15em",
    
  },
  rate_num:{
    display:"inline-block",
  },
  cardAction:{
    "&&&:before": {
        borderTop: "0",
        borderBottom: "0",
      },
      "&&:after": {
        borderBottom: "0",
        borderTop: "0"
      }
  },
  posit:{
    backgroundPosition:"unset !important",
  }
});
// const rows=[0,1,2,3,4,5,6]
class CardComp extends React.Component{
  constructor(props){
    super(props);
    this.state={
      redirect: false,
      category:"",
      Products:[],
      // category:"Electronics",
      prodKey:0,
      filtered_products:[],
    }
  }
  setRedirect = (i) => {
    this.setState({redirect: true,prodKey:i})
  }
  ///can make axios call or shld go with this
  // renderRedirect=()=>{
  //   console.log("to display")
  //   if (this.state.redirect) {
  //     console.log(this.state.prodKey);
  //     return (<DisplayProduct prop={this.state.prodKey}/>)
  //   }    
  // }
  componentDidMount(){
    if(this.props.products){
      sessionStorage.removeItem("search_key")
      this.setState({filtered_products:this.props.products})
    }
    if(this.props.category){
      axios.get(url+this.props.category ).then(response=>{
        this.setState({errorMessage:"",filtered_products:response.data})
      }).catch(error=>{
        if(error.response){
            this.setState({errorMessage:error.response.data.message,filtered_products:[]})
        }
        else{
            this.setState({errorMessage:"Server Error",filtered_products:[]})
        }
    })
    }	
    }
  render(){
    const {classes}=this.props;
    const rows=this.state.filtered_products
    // console.log(this.state.redirect)
    if(this.state.redirect){
      return <DisplayProduct from="card" items={this.state.filtered_products} prop={this.state.prodKey}/>
    }
    return(
      <div className="App">
        {rows.length>0? <Grid container className={classes.root} spacing={6}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={6}>
            {rows.map((ele,index) => (
              <Grid item key={ele.pId}>
      <CardActionArea className={classes.cardAction} onClick={()=>{this.setRedirect(ele.pId)}}>
        <Card style={{width:"350px"}} className={classes.card}>
          <CardMedia className={classes.posit} style={{maxHeight: "100%"}}
            className={classes.media}
            image={require("../assets/img/"+ele.image)}
          />
          <CardContent className={classes.content}>
          <div className={classes.ratings}>&nbsp;
            <Typography className={classes.rate_num}>
              {ele.pRating}
            </Typography>&nbsp;
            <StarsIcon className={classes.star}/>
          </div>
              {/* {ele.pName} <b style={{marginRight:"1%"}}>{ele.price}</b> */}
              <Box flexDirection="row" display="flex">
              <Box flexDirection="column" display="flex" width="89%">
                {ele.pName}
              </Box>
              {/* <div></div> */}
              {/* <div>{ele.price}</div> */}
              <Box flexDirection="column" width="10%" display="flex" justifyContent="flex-end" style={{display:"inline-block",position:"relative",}}>
              {ele.price}
              </Box>
              </Box>  
          </CardContent>
        </Card>
            </CardActionArea>
              </Grid>
            ))}
          </Grid>
        </Grid>
        
      </Grid> :null}
      </div>
    );
  }
  
  
}

export default withStyles(styles)(CardComp);
