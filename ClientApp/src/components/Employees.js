import "bootstrap/dist/css/bootstrap.min.css";
import React, {Component} from "react";
import { Container, Table, Button, Modal, ModalBody, 
    ModalHeader, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'



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
        },
        isAdmin: false,
      };

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
        });
      }
    
    componentDidMount(){
     
    this.populateEmployeeData();
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

    
    
    render(){
        return(
        <div>
        <Container>
            <h1>Empleados</h1>
            <Button color="success" onClick={() => this.mostrarModalInsertar()}
            >Agregar</Button>
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
                <th>Accion</th>
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
                  <td><Button color="primary" onClick={() => this.mostrarModalActualizar(dato)}
                  >Edit</Button></td>
                  <td><Button color="danger" onClick={() => this.eliminar(dato)}
                  >X</Button></td>
                  
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
              onClick={() => this.editar(this.state.form)}
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
