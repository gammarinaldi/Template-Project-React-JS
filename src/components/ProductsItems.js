import React, { Component } from 'react';
import { connect } from 'react-redux';
import { select_products, convertToRupiah, onActivityLog } from '../actions';
import { Card, Button, CardTitle, CardText, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faMapMarkerAlt, faBriefcase, faCalculator, faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { API_URL_1 } from '../supports/api-url/apiurl';
import axios from 'axios';
import moment from 'moment';
import { 
    WISHLIST_GETLIST,
    WISHLIST_DELETE, 
    CATEGORY_GETLIST,
    LOCATION_GETLIST
} from '../supports/api-url/apisuburl';

class ProductsItems extends Component {

    state = {
                listCategory: [],
                locationDetails: [],
                isWishlist: []
            }

    componentDidMount() {
        this.showCategory();
        this.showCity();
        this.getWishlist();
    }

    getWishlist = () => {
        axios.post(API_URL_1 + WISHLIST_GETLIST, {
            username: this.props.username
        }).then((res) => {
            this.setState({
                isWishlist: res.data
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    showCategory = () => {
        axios.get(API_URL_1 + CATEGORY_GETLIST)
        .then((res) => {
            this.setState({ 
                listCategory: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCategory = (idCategory) => {
        var listJSXCategory = this.state.listCategory.map((item) => {
           if(idCategory === item.id) {
               return item.name;
           } else return false;
        })
        return listJSXCategory;
    }

    showCity = () => {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            this.setState({ 
                locationDetails: res.data 
            });
            
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCity = (idLocation) => {
        var listJSXCity = this.state.locationDetails.map((item) => {
           if(idLocation === item.id) {
               return item.city;
           } else return false;
        })
        return listJSXCity;
    }

    onItemClick = () => {
        this.props.select_products(this.props.products); //parameternya dari ProductsGridView.js
    }

    renderWishlist = (idProduct) => {
        var wishlistBtn;
        if(this.props.username === '') {
            wishlistBtn = '';
        } else {
            if(this.state.isWishlist.filter((item) => item.idProduct === idProduct).length > 0) {
                wishlistBtn =   <button className="btn btn-danger btn-sm" style={{ fontSize: "12px" }}
                                    onClick={ () => 
                                        this.onWishlistDelete(idProduct) }>
                                <i className="fa fa-check fa-sm"></i> Saved
                                </button>;
            } else {
                wishlistBtn =   <button className="btn btn-outline-primary btn-sm" style={{ fontSize: "12px" }}
                                    onClick={ () => 
                                    this.onWishlistClick(
                                        this.props.products.id, 
                                        this.renderCategory(this.props.products.idCategory), 
                                        this.props.products.item, 
                                        this.props.products.price, 
                                        this.props.products.img) }>
                                <i className="fa fa-heart fa-sm"></i> Wishlist
                                </button>;
            }
        }

        return wishlistBtn;
    }

    onWishlistClick = (id, category, item, price, img) => {
        axios.post(API_URL_1 + WISHLIST_GETLIST, {
            username: this.props.username, idProduct: id, category, item, price, img
        }).then((res) => {
            this.getWishlist();
        }).catch((err) => {
            console.log(err);
        })
    }

    onWishlistDelete = (idProduct) => {
        axios.post(API_URL_1 + WISHLIST_GETLIST, {
            idProduct
        }).then((res) => {
            axios.delete(API_URL_1 + WISHLIST_DELETE + res.data[0].id)
            .then((res) => {
                this.getWishlist();
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    render() {
        var { id, img, item, price, idCategory, idLocation, startDate, endDate, startTime, endTime } = this.props.products;
        startDate = moment(startDate).format('D MMMM YYYY');
        endDate = moment(endDate).format('D MMMM YYYY');

            return (
                //====================START >> SHOW ITEM PRODUK=========================//
                <div>
                    <Col lg="4" style={{ marginBottom: "25px" }}>
                        <Card>
                        <center>
                            <Link to="#" onClick={this.onItemClick}><b style={{ fontSize: 'medium' }}>
                            <img src={img} width="180px" height="180px" alt={item} className="img-responsive" /></b></Link>
                        </center>
                        <br/>
                        <CardTitle id="cardTitle" style={{ padding: '0 0 0 20px', margin: '0 0 10px 0' }}>
                            <Link to="#" onClick={this.onItemClick}><b style={{ fontSize: 'medium' }}>{item}</b></Link>
                        </CardTitle>
                        <CardText id="cardCategory" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                            <FontAwesomeIcon icon={faBriefcase} size="md" />&nbsp;<strong>{this.renderCategory(idCategory)}</strong>
                        </CardText>
                        <CardText id="cardDate" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                            <FontAwesomeIcon icon={faCalendarCheck} size="md" />&nbsp;{startDate} to {endDate}
                        </CardText>
                        <CardText id="cardTime" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                            <FontAwesomeIcon icon={faClock} size="md" />&nbsp;{startTime} to {endTime}
                        </CardText>
                        <CardText id="eventVenue" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} size="md" />&nbsp;
                            {this.renderCity(idLocation)}
                        </CardText>
                        <CardText id="id" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                            ID Product: {id}
                        </CardText>
                        <CardText id="cardPrice" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#ea7f1c' }}>
                        <FontAwesomeIcon icon={faCalculator} size="md" />&nbsp;{this.props.convertToRupiah(price)}
                        </CardText>
                        <br/>
                        <CardText id="eventBookShare" style={{ padding: '0 20px 0 20px', margin: '0 0 10px 0', color: '#898989' }}>
                            <div align="center">
                            {this.renderWishlist(id)}
                            </div>
                        </CardText>
                        <Button style={{ margin: '0 10px 10px 10px', fontSize: "14px" }}
                            onClick={this.onItemClick} 
                            color="success"><strong>View Details</strong>
                        </Button>
                        </Card>
                    </Col>
                </div>
                //====================END >> SHOW ITEM PRODUK=========================//
            )
    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { select_products, convertToRupiah, onActivityLog })(ProductsItems);