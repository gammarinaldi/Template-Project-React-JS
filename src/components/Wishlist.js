import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { convertToRupiah, sortingJSON } from '../actions';
import Pagination from 'react-js-pagination';
import { WISHLIST_GETLIST, WISHLIST_DELETE } from '../supports/api-url/apisuburl';

class Wishlist extends Component {

    state = { listWishlist: [], activePage: 1, itemPerPage: 5, open: false }
    
    componentDidMount() {
        this.showWishlist();
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    showWishlist = () => {
        axios.post(API_URL_1 + WISHLIST_GETLIST, {
            username: this.props.username
        }).then((res) => {
            console.log(res.data)
            this.setState({ 
                listWishlist: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (idWishlist, item) => {
        if(window.confirm('Are you sure want to delete: (' + idWishlist + ') ' + item + ' ?')) {
            axios.delete(API_URL_1 + WISHLIST_DELETE + idWishlist)
                .then((res) => {
                    this.showWishlist();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    btnCustom = () => {
        var btnCustom;
        btnCustom = <h5>
                        <Link to="/productsgridview" className="btn btn-info" style={{ fontSize: "13px" }}>
                        <i className="fa fa-shopping-cart fa-sm"></i>
                        &nbsp; Continue Shopping
                        </Link>
                    </h5>;
        return btnCustom;
    }
  
    renderlistWishlist = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListWishlist = this.state.listWishlist.sort(this.props.sortingJSON('id', 'desc'));
        var renderedProjects = sortedListWishlist.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXWishlist = renderedProjects.map((item) => {
            //====================SHOW >> SHOW ITEM PRODUK=========================//
            return (
                <tr key={item.idProduct}>
                    <td><center>{item.idProduct}</center></td>
                    <td><Link to={`/productsdetails?id=${item.idProduct}`}>{item.item}</Link></td>
                    <td>{item.categoryName}</td>
                    <td>{this.props.convertToRupiah(item.price)}</td>
                    <td><center>
                        <a href={`${API_URL_1}${item.img}`} target="_blank" rel="noopener noreferrer">
                        <img src={`${API_URL_1}${item.img}`} alt={item.item} width={100} /></a>
                    </center></td>
                    <td>
                        <center>
                        <Link to="#" className="btn btn-danger" onClick={ () => this.onBtnDeleteClick(item.idWishlist, item.item) }>
                        <i className="fa fa-trash fa-sm"></i>
                        </Link>
                        </center>
                    </td>
                </tr>
            )
        //====================END >> SHOW ITEM PRODUK=========================//
        });
        
        return listJSXWishlist;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div className="card bg-light" style={{ fontSize: "13px" }}>
                    <div className="col-lg-8 align-self-center">
                        <div className="col-lg-12 text-center" style={{ paddingTop: "20px" }}>
                            <h2 className="section-heading text-uppercase">Wishlist</h2>
                            <h3 className="section-subheading text-muted">Your favorite products</h3>
                            <br/>
                        </div>
                        <br/>
                        <div className="table-responsive col-lg-12 shadow p-3 mb-5 bg-white rounded">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>PID</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Category</center></th>
                                        <th scope="col"><center>Price</center></th>
                                        <th scope="col"><center>Image</center></th>
                                        <th scope="col"><center>Action</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.renderlistWishlist()}
                                </tbody>
                                <tfoot>

                                    <tr>
                                        <td colSpan="8">
                                            <div align="right">
                                                {this.btnCustom()}
                                            </div>
                                        </td>
                                    </tr>

                                </tfoot>
                            </table>
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={this.state.itemPerPage}
                                totalItemsCount={this.state.listWishlist.length}
                                pageRangeDisplayed={5}
                                onChange={this.handlePageChange.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <Redirect to="/login" />
            )
        }
    }

}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { convertToRupiah, sortingJSON })(Wishlist);