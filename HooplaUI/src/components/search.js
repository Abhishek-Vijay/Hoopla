import React from "react";
// import ReactDOM from "react-dom";
// import { withStyles } from "@material-ui/core/styles";
import Card from "./cards.js"
import axios from "axios";
class Search extends React.Component{
    constructor(props){
      super(props);
      this.state={
        products:[]
      }
    }
componentDidMount(){
    var search=sessionStorage.getItem("search_key")
    axios.get("http://localhost:2000/prodSearch/"+search).then(response=>{
    // console.log("in axios call")
        this.setState({products:response.data})
        // console.log(this.state.products)
  }).catch(error=>{
    if(error.response){
        this.setState({errorMessage:error.response.data.message,cartItems:[],successMessage:""})
        // console.log("err1")
    }
    else{
        this.setState({errorMessage:"Server Error",cartItems:[],successMessage:""})
        // console.log("err2")
    }
})	
}
render()
{
    // const {classes}=this.props;
    // console.log("to card")
    if(this.state.products.length>0){
        return(
            <Card products={this.state.products}/>
        )
    }
    return <div style={{color:"red",marginLeft:"10%"}}>Sorry!! no relevant products</div>
}
}
export default (Search);
