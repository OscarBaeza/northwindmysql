import "bootstrap/dist/css/bootstrap.min.css";
import React, {Component} from "react";
import { Container, Table, Button, Modal, ModalBody, 
    ModalHeader, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'

export default class Movements extends React.Component
{
    state = {
        data: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
          movementId: "",
          date:"",
          originWarehouseId: "",
          targetWarehouseId: "",
          type: "",
          companyId: "",
          employeeId: "",
        },
        isAdmin: false,
      };

      async populateMovementData(){
        const token = await authService.getAccessToken();
        const response = await fetch('/api/Movements', {
          headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ data:data})
        console.log(data)
        ;

        authService.getUser().then((u) => {
          const isAdmin = authService.isAdmin(u);
          this.setState({ isAdmin: isAdmin });
        });
      }

        componentDidMount(){
     
        this.populateMovementData();
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
              <h1>Movimientos</h1>
              <Button color="success" onClick={() => this.mostrarModalInsertar()}
              >Agregar</Button>
              <Table hover>
              <thead>
                <tr>
                  <th>
                  ID
                  </th>
                  <th>Fecha</th>
                  <th>Almacen Origen Id</th>
                  <th>Almacen Destino Id</th>
                  <th>Tipo</th>
 
                  <th>Id compañia</th>
                  <th>Id empleado</th>
                </tr>
              </thead>
              <tbody>
              {this.state.data.map((dato,cont) => (
                  <tr key={cont}>
                    <td>{dato.movementId}</td>
                    <td>{dato.date}</td>
                    <td align="center">{dato.originWarehouseId}</td>
                    <td align="center">{dato.targetWarehouseId}</td>
 
                    <td>{dato.type}</td>
                    <td align="center">{dato.companyId}</td>
                    <td>{dato.employeeId}</td>
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
                <h3>Editar Movimiento</h3>
              </div>
            </ModalHeader>
  
            <ModalBody>
              <FormGroup>
                <label>Id:</label>
  
                <input
                  className="form-control"
                  readOnly
                  type="text"
                  value={this.state.form.companyId}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Fecha:</label>
                <input
                  className="form-control"
                  name="lastName"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.date}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Almacen Origen Id:</label>
                <input
                  className="form-control"
                  name="firstName"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.originWarehouseId}
                />
              </FormGroup>
              <FormGroup>
                <label>Almacen Destino Id:</label>
                <input
                  className="form-control"
                  name="hireDate"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.targetWarehouseId}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Tipo:</label>
                <input
                  className="form-control"
                  name="address"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.type}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Compañia:</label>
                <input
                  className="form-control"
                  name="homePhone"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.companyId}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Empleado:</label>
                <input
                  className="form-control"
                  name="email"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.employeeId}
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
                <h3>Agregar Movimiento</h3>
              </div>
            </ModalHeader>
  
            <ModalBody>
              <FormGroup>
                <label>Almacen Origen Id:</label>
                <input
                  className="form-control"
                  name="lastName"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Almacen Destino Id:</label>
                <input
                  className="form-control"
                  name="firstName"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <label>Tipo:</label>
                <input
                  className="form-control"
                  name="hireDate"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Compañia:</label>
                <input
                  className="form-control"
                  name="address"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Empleado:</label>
                <input
                  className="form-control"
                  name="homePhone"
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