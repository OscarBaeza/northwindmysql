import "bootstrap/dist/css/bootstrap.min.css";
import React, {Component} from "react";
import { Container, Table, Button, Modal, ModalBody, 
    ModalHeader, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'
import axios from "axios";


export default class Empleados extends React.Component
{
    state = {
        data: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
          employeeId: "",
          lastName: "",
          firstName: "",
          hireDate: "",
          address: "",
          homePhone: "",
          email: "",
          password: "",
          companyId:1,
        },
        isAdmin: false,
      
      };

      componentDidMount(){
     
        this.populateEmployeeData();
        }
    

      async populateEmployeeData() {
        const token = await authService.getAccessToken();
        const response = await fetch('/api/employees', {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ data:data});

        authService.getUser().then((u) => {
          const isAdmin = authService.isAdmin(u);
          this.setState({ isAdmin: isAdmin });
          console.log(isAdmin);
        });


      }

      mostrarModalActualizar = (dato) => {
        this.setState({
          form: dato,
          modalActualizar: true,
        });
      };

      cerrarModalActualizar = () => {
        this.setState({ modalActualizar: false });
      };

      toggleModalActualizar(v) {
        this.setState({ modalActualizar: !v });
      }

      mostrarModalInsertar = () => {
        this.setState({
          modalInsertar: true,
        });
      };

      cerrarModalInsertar = () => {
        this.setState({ modalInsertar: false });
      };

      toggleModalInsertar(v) {
        this.setState({ modalInsertar: !v });
      }

      handleChange = (e) => {
        this.setState({
          form: {
            ...this.state.form,
            [e.target.name]: e.target.value,
          },
        });
      };

      insertar = async () => {
        var data = { ...this.state.form };
        const employee = {
          employeeId: 0,
            lastName: data.lastName,
            firstName: data.firstName,
            hireDate: data.hireDate,
            address: data.address,
            homePhone: data.homePhone,
            email: data.email,
            password: data.password,
            companyId:1,

        };
        console.log(employee);
        const token = await authService.getAccessToken();
        const headers = !token ? {} : { Authorization: `Bearer ${token}` };
        const response = await axios.post(
          `api/employees`,
          {
            employeeId: 0,
            lastName: data.lastName,
            firstName: data.firstName,
            hireDate: data.hireDate,
            address: data.address,
            homePhone: data.homePhone,
            email: data.email,
            password: data.password,
            companyId: 1,
          },
          headers
        );
        
        console.log(response);
        if (response.status != 403) {
          this.populateEmployeeData();
        } else {
          // console.log("Sin autorizacion");
        }
        this.setState({ modalInsertar: false });
      };

      create = async () => {
        var data = { ...this.state.form };
        const employee = {
          employeeId: 0,
            lastName: data.lastName,
            firstName: data.firstName,
            hireDate: data.hireDate,
            address: data.address,
            homePhone: data.homePhone,
            email: data.email,
            password: data.password,
            companyId:1,
        };
        const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        };

       await fetch('/api/employees', options)
            .then(
                (response) =>  {return response.status;      }
            ).then(
                (code) => {
                    if(code==201){
                        console.log(code);
                        console.log(employee);
                        this.componentDidMount();
                        
                    }else{
                      console.log(code);
                    }
                }
            );
            this.setState({ modalInsertar: false });
        
    }

    //eliminar

    eliminar = async (dato) => {
      var opcion = window.confirm(
        "Eliminar ? " + dato.employeeId
      );
      if (opcion == true) {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/employees/${dato.employeeId}`, {
          headers: !token ? {} : { Authorization: `Bearer ${token}` },
          method: "DELETE",
        });
        console.log(response);
        if (response.status != 403) {
          this.populateEmployeeData();
        } else {
          // console.log("Sin autorizacion");
        }
        this.setState({ modalActualizar: false });
      }
    };

    //Editar

    editar = async () => {
      var data = { ...this.state.form };
        const employee = {
           employeeId: data.employeeId,
            lastName: data.lastName,
            firstName: data.firstName,
            hireDate: data.hireDate,
            address: data.address,
            homePhone: data.homePhone,
            email: data.email,
            password: data.password,
            companyId:1,
        };
      const token = await authService.getAccessToken();
      const headers = !token ? {} : { Authorization: `Bearer ${token}` };
      const response = await axios.put(
        `/api/employees/${employee.employeeId}`,
        {
          employeeId: data.employeeId,
          lastName: data.lastName,
          firstName: data.firstName,
          hireDate: data.hireDate,
          address: data.address,
          homePhone: data.homePhone,
          email: data.email,
          password: data.password,
          companyId:1,
        },
        headers
      );
      console.log(response);
      if (response.status != 403) {
        this.populateEmployeeData();
      } else {
        // console.log("Sin autorizacion");
      }
      this.setState({ modalActualizar: false });
    };
  
    
  
    
    
    
    render(){
        return(
        <div>
        <Container>
            <h1>Empleados</h1>
            {this.state.isAdmin?(
              <Button color="success" onClick={() => this.mostrarModalInsertar()}
              >Agregar</Button>
            ):(
              <>
              </>
            )}
            
            <Table hover>
            <thead>
              <tr>
                <th>
                ID
                </th>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Fecha de ingreso</th>
                <th>Dirección</th>
                <th>Telefono</th>
                <th>Correo</th>
                {this.state.isAdmin?(
                  <th>Accion</th>
                ):(
                  <></>
                )}
                
                
              </tr>
            </thead>
            <tbody>
            {this.state.data.map((dato) => (
                <tr key={dato.employeeId}>
                  <td>{dato.employeeId}</td>
                  <td>{dato.lastName}</td>
                  <td>{dato.firstName}</td>
                  <td>{dato.hireDate}</td>
                  <td>{dato.address}</td>
                  <td>{dato.homePhone}</td>
                  <td>{dato.email}</td>
                  {this.state.isAdmin ? (
                    <>
                    <td><Button color="primary" onClick={() => this.mostrarModalActualizar(dato)}
                    >Edit</Button></td>
                    <td><Button color="danger" onClick={() => this.eliminar(dato)}
                    >X</Button></td>
                    </>
                  ):(
                    <></>
                  )}
                  
                  
                </tr>
              ))}
            </tbody>
          </Table>
          </Container>

          <Modal
          isOpen={this.state.modalActualizar}
          toggle={() => this.toggleModalActualizar(this.state.modalActualizar)}
        >
          <ModalHeader>
            <div>
              <h3>Editar Registro</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Id:</label>

              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.form.employeeId}
              />
            </FormGroup>

            <FormGroup>
              <label>Apellidos:</label>
              <input
                className="form-control"
                name="lastName"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.lastName}
              />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="firstName"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.firstName}
              />
            </FormGroup>
            <FormGroup>
              <label>Fecha de ingreso:</label>
              <input
                className="form-control"
                name="hireDate"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.hireDate}
              />
            </FormGroup>

            <FormGroup>
              <label>Direccion:</label>
              <input
                className="form-control"
                name="address"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.address}
              />
            </FormGroup>

            <FormGroup>
              <label>Telefono:</label>
              <input
                className="form-control"
                name="homePhone"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.homePhone}
              />
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input
                className="form-control"
                name="email"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.email}
              />
            </FormGroup>

            <FormGroup>
              <label>Clave:</label>
              <input
                className="form-control"
                name="password"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.password}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.editar()}
            >
              Editar
            </Button>
            <Button color="danger" onClick={() => this.cerrarModalActualizar()}>
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.modalInsertar}
          toggle={() => this.toggleModalInsertar(this.state.modalInsertar)}
        >
          <ModalHeader>
            <div>
              <h3>Insertar Empleado</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Apellidos:</label>
              <input
                className="form-control"
                name="lastName"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Nombre:</label>
              <input
                className="form-control"
                name="firstName"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Fecha de ingreso:</label>
              <input
                className="form-control"
                name="hireDate"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Direccion:</label>
              <input
                className="form-control"
                name="address"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Telefono:</label>
              <input
                className="form-control"
                name="homePhone"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Correo:</label>
              <input
                className="form-control"
                name="email"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Clave:</label>
              <input
                className="form-control"
                name="password"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button color="primary" onClick={() => this.insertar()}>
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal> 

          </div>
          
        );
    }
}
