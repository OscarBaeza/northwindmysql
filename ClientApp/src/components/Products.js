import "bootstrap/dist/css/bootstrap.min.css";
import React, {Component} from "react";
import { Container, Table, Button, Modal, ModalBody, 
    ModalHeader, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'
import axios from "axios";

export default class  Products extends React.Component
{



    render(){
        return(
            <div>
                <h1>Productos</h1>
            </div>
        )
    }
}