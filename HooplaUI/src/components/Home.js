import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './home.css';
import Card from "./cards"
import withStyles from '@material-ui/core/styles/withStyles'
const styler = theme => ({
  container: {
    background: "radial-gradient(circle,rgba(248,248,248,1) 52% ,rgba(153,160,159,1)91%);"
  },
  centerc: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
    marginBottom: "0%",
  }, buttons: {
    // marginLeft:"10em"
    // paddingLeft : "20px"
  }, link: {
    "&:hover": {
      // textColor:"#f50057",
      backgroundColor: "#f50057",
      color: "white",
      border: "1px #f50057",
      borderRadius: "4px",
      cursor: "pointer",
    }
  },
  curs: {
    "&:hover": {
      cursor: "pointer",
    }
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      category: "Electronics"
    }
  }
  category = (x) => {
    // var x=e.target.value

    this.setState({ redirect: true, category: x })
    // return <Card category={x}/>
  }

  render() {
    const { classes } = this.props
    var settings = {
      dots: true,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      lazyLoad: true,
      arrows: true,
      autoplaySpeed: 2000,
      className: "slides"
    };
    // if (this.state.redirect) {
    //   return <Card category={this.state.category} />
    // }
    return (
      <React.Fragment>
        <AppBar style={{ marginTop: "4.8%", minHeight: "45px" }}>
          <Toolbar>

            <div style={{ textDecoration: "none" }}><a className={classes.link} onClick={() => { this.category("Electronics") }} style={{ color: "white", fontSize: "20px" }}>ELECTRONICS</a></div>
            <div style={{ textDecoration: "none" }} className="ml-auto"><a className={classes.link} onClick={() => { this.category("Shoes") }} style={{ color: "white", fontSize: "20px" }}>SHOES</a></div>
            <div style={{ textDecoration: "none" }} className="ml-auto"><a className={classes.link} onClick={() => { this.category("Furniture") }} style={{ color: "white", fontSize: "20px" }}>FURNITURE</a></div>
            <div style={{ textDecoration: "none" }} className="ml-auto"><a className={classes.link} onClick={() => { this.category("Clothing") }} style={{ color: "white", fontSize: "20px" }}>CLOTHING</a></div>
          </Toolbar>
        </AppBar>

        <Slider {...settings} className={classes.container} style={{height: "350px"}} >
        <div className={classes.curs}>
            <a onClick={() => { this.category("Electronics") }} >
              <img className={classes.centerc} src={require("../assets/img/mobiles.png")} alt="Mobiles Pic" style={{height: "350px"}}/>
            </a>
            {/* <img className={classes.centerc} src={require("../assets/img/mobiles.png")} alt="Mobiles Pic" /> */}
          </div>
          <div className={classes.curs}>
            <a onClick={() => { this.category("Shoes") }}>
              <img className={classes.centerc} src={require("../assets/img/shoes.png")} alt="Shoes Pic" style={{height: "350px"}}/>
            </a>
            {/* <img className={classes.centerc} src={require("../assets/img/shoes.png")} alt="Shoes Pic" /> */}
          </div>
          <div className={classes.curs}>
            <a onClick={() => { this.category("Furniture") }}>
              <img className={classes.centerc} src={require("../assets/img/furnitures.png")} alt="Furniture Pic" style={{height: "350px"}}/>
            </a>
            {/* <img className={classes.centerc} src={require("../assets/img/furnitures.png")} alt="Furniture Pic" /> */}
          </div>
          <div className={classes.curs}>
            {/* <img className={classes.centerc} src={require("../assets/img/clothing.png")} alt="Clothing Pic" /> */}
            <a onClick={() => { this.category("Clothing") }}>
              <img className={classes.centerc} src={require("../assets/img/clothing.png")} alt="Clothing Pic" style={{height: "350px"}}/>
            </a>
          </div>
        </Slider>
        <br/>
        <br/>
        {/* {console.log(this.state.category)} */}
        {/* {(this.state.redirect) ? */}
      <Card category={this.state.category} /> 
      {/* : "No Product's to Show" } */}
      </React.Fragment>
      // </div>
    );
  }
}

export default withStyles(styler)(Home);
