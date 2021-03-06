import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { onActivityLog } from '../../actions';
import { 
    PRODUCTS_GET, 
    LOCATION_GET, 
    CATEGORY_GET, 
    PRODUCTS_EDIT, 
    PRODUCTS_DELETE, 
    LOCATION_GETLIST, 
    CATEGORY_GETLIST 
} from '../../supports/api-url/apisuburl';
import moment from 'moment';
import SideBar from './SideBar';

class ProductsEditDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listProduct: [],
            listLocation: [],
            locationDetails: [],
            listCategory: [],
            listAllCategory: [],
            tinyMCE: '',
            days: [],
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            updateImgChange: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.showProduct();
        this.showLocation();
        this.showCity();
        this.showCategory();
    }

    handleInputChange(event) {

        if(event.target.checked === true && event.target.name === 'Sunday') {
            this.setState({ sunday: true });
        } else if(event.target.checked === false && event.target.name === 'Sunday') {
            this.setState({ sunday: false });
        } else if(event.target.checked === true && event.target.name === 'Monday') {
            this.setState({ monday: true });
        } else if(event.target.checked === false && event.target.name === 'Monday') {
            this.setState({ monday: false });
        } else if(event.target.checked === true && event.target.name === 'Tuesday') {
            this.setState({ tuesday: true });
        } else if(event.target.checked === false && event.target.name === 'Tuesday') {
            this.setState({ tuesday: false });
        } else if(event.target.checked === true && event.target.name === 'Wednesday') {
            this.setState({ wednesday: true });
        } else if(event.target.checked === false && event.target.name === 'Wednesday') {
            this.setState({ wednesday: false });
        } else if(event.target.checked === true && event.target.name === 'Thursday') {
            this.setState({ thursday: true });
        } else if(event.target.checked === false && event.target.name === 'Thursday') {
            this.setState({ thursday: false });
        } else if(event.target.checked === true && event.target.name === 'Friday') {
            this.setState({ friday: true });
        } else if(event.target.checked === false && event.target.name === 'Friday') {
            this.setState({ friday: false });
        } else if(event.target.checked === true && event.target.name === 'Saturday') {
            this.setState({ saturday: true });
        } else if(event.target.checked === false && event.target.name === 'Saturday') {
            this.setState({ saturday: false });
        } 

        if(event.target.type === 'checkbox' && event.target.checked) {
            this.state.days.push(event.target.name);
        } else if(event.target.type === 'checkbox' && !event.target.checked) {
            var index = 0;
            index = this.state.days.indexOf(event.target.name);
            if (index > -1) {
                this.state.days.splice(index, 1);
             }
        }

        console.log(this.state.days);

    }

    handleEditorChange = (e) => {
        console.log('Content was updated:', e.target.getContent());
        this.setState({ tinyMCE: e.target.getContent() });
    } 

    showProduct() {
        var params = queryString.parse(this.props.location.search);
        axios.post(API_URL_1 + PRODUCTS_GET, {
            id: params.id
        })
        .then((res) => {
            var days = res.data[0].days.split(',');
            this.setState({
                listProduct: res.data[0],
                tinyMCE: res.data[0].desc,
                updateImgChange: res.data[0].img,
                days
            });

            for(let i = 0; i < days.length; i++) {
                switch(days[i]) {
                    case 'Sunday' : 
                        this.setState({ sunday: true });
                        break;
                    case 'Monday' : 
                        this.setState({ monday: true });
                        break;
                    case 'Tuesday' : 
                        this.setState({ tuesday: true });
                        break;
                    case 'Wednesday' : 
                        this.setState({ wednesday: true });
                        break;
                    case 'Thursday' : 
                        this.setState({ thursday: true });
                        break;
                    case 'Friday' : 
                        this.setState({ friday: true });
                        break;
                    case 'Saturday' : 
                        this.setState({ saturday: true });
                        break;
                    default:
                        break;
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onBtnSaveClick(id) {
        console.log(document.getElementById('updateImg').files[0])

        var formData = new FormData();
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        const category = this.refs.updateCategory.value;
        const location = this.refs.updateLocation.value;
        const address = this.refs.updateAddress.value;
        const item = this.refs.updateItem.value;
        const price = this.refs.updatePrice.value;
        const startDate = moment(this.refs.updateStartDate.value).format('YYYY-MM-DD');
        const endDate = moment(this.refs.updateEndDate.value).format('YYYY-MM-DD');
        const startTime = this.refs.updateStartTime.value;
        const endTime = this.refs.updateEndTime.value;
        const desc = this.state.tinyMCE;
        const days = this.state.days;

        if(document.getElementById("updateImg").files[0] !== undefined){
            formData.append('img', document.getElementById('updateImg').files[0]);
            var data = {
                idCategory: category, 
                idLocation: location,
                address, item, price, startDate, endDate, startTime, endTime, desc, days: days.toString()
            }
        } else {
            data = {
                idCategory: category, 
                idLocation: location,
                img: this.state.listProduct.img,
                address, item, price, startDate, endDate, startTime, endTime, desc, days: days.toString()
            }
        }

        formData.append('data', JSON.stringify(data)); //Convert object javascript menjadi JSON

        axios.post(API_URL_1 + LOCATION_GET, {
            city: location
        }).then((res) => {
            this.setState({ 
                idLocation: res.data.id 
            });

            axios.post(API_URL_1 + CATEGORY_GET, {
                name: category
            }).then((res) => {
                this.setState({ 
                    idCategory: res.data.id
                });

                axios.put(API_URL_1 + PRODUCTS_EDIT + id, formData, headers)
                .then((res) => {
                    document.getElementById('message').innerHTML = '<strong>Update success!</strong>';
                    //=======> Activity Log
                    this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Edit product: '+item});
                    //window.location.replace('/admin/manageproducts');
                }).catch((err) => {
                    console.log(err);
                })

            }).catch((err) => {
                console.log(err);
            })

        }).catch((err) => {
            console.log(err);
        })
        
    }

    onBtnDeleteClick(id, item) {
        if(window.confirm('Are you sure want to delete: ' + item + ' ?')) {
            axios.delete(API_URL_1 + PRODUCTS_DELETE + id)
            .then((res) => {
                window.location.replace('/admin/manageproducts');
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    onUpdateImgChange = () => {
        if(document.getElementById("updateImg").files[0] !== undefined) {
            this.setState({updateImgChange : document.getElementById("updateImg").files[0].name})
        }
        else {
            this.setState({updateImgChange: this.state.listProduct.img})
        }
    }

    showCity() {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            this.setState({ 
                locationDetails: res.data
            });
            
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCity(idLocation) {
        var listJSXCity = this.state.locationDetails.map((item) => {
           if(idLocation === item.id) {
               return item.city;
           } else return false;
        })
        return listJSXCity;
    }

    showLocation() {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            this.setState({ 
                listLocation: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderListLocation() {
        var listJSXLocation = this.state.listLocation.map((item) => {
            return (
                <option value={item.id}>{item.city}</option>
            )
        })
        return listJSXLocation;
    }

    showCategory() {
        axios.get(API_URL_1 + CATEGORY_GETLIST)
        .then((res) => {
            this.setState({ 
                listCategory: res.data,
                listAllCategory: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCategory(idCategory) {
        var listJSXCategory = this.state.listCategory.map((item) => {
           if(idCategory === item.id) {
               return item.name;
           } else return false;
        })
        return listJSXCategory;
    }

    renderAllCategory() {
        var listJSXAllCategory = this.state.listAllCategory.map((item) => {
            return (
                <option value={item.id}>{item.name}</option>
            )
        })
        return listJSXAllCategory;
    }

    render() {
        var { id, idCategory, idLocation, address, item, price, img, startDate, endDate, startTime, endTime } = this.state.listProduct;

        //====================START >> EDIT ITEM PRODUK=========================//
        if(this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") {
            return(
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                <style>{"tr{border-top: hidden;}"}</style>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                        <SideBar active='Edit Product' />
                            </div>
                            <div className="card bg-light col-lg-6" style={{ padding: "20px" }}>
                            <h4>Edit Product Details</h4>
                            <hr/>

                            <div className="card shadow p-3 mb-5 bg-white rounded">
                                <div className="table-responsive ">
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td>&nbsp;PID</td>
                                                <td>:</td>
                                                <td>{id}</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Item</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="text" defaultValue={item} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateItem" className="form-control form-control-lg" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Category</td>
                                                <td>:</td>
                                                <td>
                                                    <select ref="updateCategory" className="form-control form-control-lg" style={{ fontSize: "12px" }}>
                                                        <option value={idCategory}>{this.renderCategory(idCategory)}</option>
                                                        {this.renderAllCategory()}
                                                    </select>
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Location</td>
                                                <td>:</td>
                                                <td>
                                                    <select ref="updateLocation" className="form-control form-control-lg" style={{ fontSize: "12px" }}>
                                                        <option value={idLocation}>{this.renderCity(idLocation)}</option>
                                                        {this.renderListLocation()}
                                                    </select>    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Address</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="text" defaultValue={address} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateAddress" className="form-control form-control-lg" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Price</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="number" defaultValue={price} style={{ fontSize: "12px" }} 
                                                        ref="updatePrice" className="form-control form-control-lg" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Image</td>
                                                <td>:</td>
                                                <td>
                                                    <a href={`${API_URL_1}${img}`} target="_blank" rel="noopener noreferrer">
                                                    <img src={`${API_URL_1}${img}`} alt={item} width={100} /></a>
                                                    <br/><br/>  
                                                    <input type="file" id="updateImg" name="updateImg" 
                                                    label={this.state.updateImgChange} onChange={this.onUpdateImgChange} /> 
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Start Date</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="date" 
                                                        size="4" style={{ fontSize: "12px" }}
                                                        defaultValue={startDate}
                                                        ref="updateStartDate" className="form-control form-control-lg" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;End Date</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="date"
                                                        size="4" style={{ fontSize: "12px" }} 
                                                        defaultValue={endDate}
                                                        ref="updateEndDate" className="form-control form-control-lg" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Start Time</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="time" defaultValue={startTime} 
                                                        size="4" style={{ fontSize: "12px" }}
                                                        ref="updateStartTime" className="form-control form-control-lg" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;End Time</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="time" defaultValue={endTime} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateEndTime" className="form-control form-control-lg" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Day(s)</td>
                                                <td>:</td>
                                                <td>
                                                <input name="Sunday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.sunday} /> Sunday &nbsp;
                                                <input name="Monday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.monday} /> Monday &nbsp;
                                                <input name="Tuesday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.tuesday} /> Tuesday &nbsp;
                                                <input name="Wednesday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.wednesday} /> Wednesday &nbsp;
                                                <input name="Thursday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.thursday} /> Thursday &nbsp;
                                                <input name="Friday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.friday} /> Friday &nbsp;
                                                <input name="Saturday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.saturday} /> Saturday &nbsp;
                                                &nbsp;</td>
                                            </tr>
                                            <tr><td></td><td></td><td></td></tr>
                                            <tr>
                                                <td>&nbsp;Description</td>
                                                <td>:</td>
                                                <td>
                                                    <Editor
                                                        apiKey='rh7l8avejcgd40a81hu5b2e4u9g441bva85ut25b72kkop0a'
                                                        initialValue={this.state.tinyMCE}
                                                        init={{
                                                            height: 300,
                                                            plugins: [
                                                                'advlist autolink lists link image charmap print preview anchor textcolor',
                                                                'searchreplace visualblocks code fullscreen',
                                                                'insertdatetime media table paste code help wordcount'
                                                            ],
                                                            toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                                            content_css: [
                                                                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                                                                '//www.tiny.cloud/css/codepen.min.css'
                                                            ]
                                                        }}
                                                        onChange={this.handleEditorChange}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td>
                                                    <br/>
                                                    <button className="btn btn-success" style={{ fontSize: "12px" }}
                                                        onClick={() => this.onBtnSaveClick(id)}>
                                                        <i className="fa fa-save fa-sm"></i> Update
                                                    </button>    
                                                &nbsp;
                                                &nbsp;
                                                    <button className="btn btn-danger" style={{ fontSize: "12px" }}
                                                        onClick={ () => this.onBtnDeleteClick(id, item) }>
                                                        <i className="fa fa-trash fa-sm"></i> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;</td>
                                                <td>&nbsp;</td>
                                                <td><div id="message"></div>&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <Redirect to="/login" />
            )
        }
        //====================END >> EDIT ITEM PRODUK=========================//

    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { onActivityLog })(ProductsEditDetails);