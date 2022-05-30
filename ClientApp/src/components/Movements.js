import "bootstrap/dist/css/bootstrap.min.css";
import React, {Component} from "react";
import { Container, Table, Button, Modal, ModalBody, 
    ModalHeader, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import authService from './api-authorization/AuthorizeService';
import axios from "axios";

export default class Movements extends React.Component
{
    state = {
        data: [],
        modalActualizar: false,
        modalInsertar: false,
        form: {
          movementId: 0,
          date: "",
          originWarehouseId: "",
          targetWarehouseId: null,
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

        handleChange = (e) => {
          this.setState({
            form: {
              ...this.state.form,
              [e.target.name]: e.target.value,
            },
          });
        };

        

        create = () => {
          var data = { ...this.state.form };
          const movement = {
              MovementId: 0,
              Date: data.date,
              OriginWarehouseId: data.originWarehouseId,
              TargetWarehouseId: data.targetWarehouseId,
              Type: data.type,
              CompanyId: data.companyId,
              EmployeeId: data.employeeId,
          };
          console.log(movement);
          const options = {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(movement)
          };
  
          fetch('api/Movements', options)
              .then(
                  (response) =>  {return response.status;}
              ).then(
                  (code) => {
                      if(code==201){
                          console.log(code);
                          
          
                          this.populateMovementData();
                          this.setState({ modalInsertar: false });                                       
                         
                          
                      }else{
                        console.log(code);
                      }
                  }
              );
          
      }

      edit = () => {
    
        var data = { ...this.state.form };
          const movement = {
              MovementId: data.movementId,
              Date: data.date,
              OriginWarehouseId: data.originWarehouseId,
              TargetWarehouseId: data.targetWarehouseId,
              Type: data.type,
              CompanyId: data.companyId,
              EmployeeId: data.employeeId,
          };
          

        const options = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(movement)
        };
        console.log(movement);
        fetch('api/Movements/'+movement.MovementId, options)
            .then(
                (response) =>  {return response.status;      }
            ).then(
                (code) => {
                    if(code==204){
                        console.log(code);
                        
                        this.populateMovementData();
                        this.cerrarModalActualizar();                                     
                        
                        
                    }
                }
            );
        
    }


    eliminar = async (dato) => {
      var opcion = window.confirm(
        "Eliminar ? " + dato.movementId
      );
      console.log(dato);
      if (opcion == true) {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Movements/${dato.movementId}`, {
          headers: !token ? {} : { Authorization: `Bearer ${token}` },
          method: "DELETE",
        });
        console.log(response);
        if (response.status != 403) {
          this.populateMovementData();
        } else {
          // console.log("Sin autorizacion");
        }
        this.setState({ modalActualizar: false });
      }
    };







        render(){
          return(
          <div>
          <Container>
              <h1>Movimientos</h1>
              {this.state.isAdmin ? (
            <>
              <Button
                color="success"
                onClick={() => this.mostrarModalInsertar()}
              >
                Crear
              </Button>
            </>
          ) : (
            <></>
          )}
          <br />
          <br />
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
                  {this.state.isAdmin?(
                    <th>Accion</th>
                  ):(
                    <>
                    </>
                  )}
                  
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
                    {this.state.isAdmin ? (
                      <>
                      <td><Button color="primary" onClick={() => this.mostrarModalActualizar(dato)}
                      >Edit</Button></td>
                      <td><Button color="danger" onClick={() => this.eliminar(dato)}
                      >X</Button></td>
                      </>
                    ):(
                      <>
                      </>
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
                  value={this.state.form.movementId}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Fecha:</label>
                <input
                  className="form-control"
                  name="date"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.date}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Almacen Origen Id:</label>
                <input
                  className="form-control"
                  name="originWarehouseId"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.originWarehouseId}
                />
              </FormGroup>
              <FormGroup>
                <label>Almacen Destino Id:</label>
                <input
                  className="form-control"
                  name="targetWarehouseId"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.targetWarehouseId}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Tipo:</label>
                <input
                  className="form-control"
                  name="type"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.type}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Compañia:</label>
                <input
                  className="form-control"
                  name="companyId"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.companyId}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Empleado:</label>
                <input
                  className="form-control"
                  name="employeeId"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.form.employeeId}
                />
              </FormGroup>
  
              
            </ModalBody>
  
            <ModalFooter>
              <Button
                color="primary"
                onClick={() => this.edit()}
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
                <label>Fecha</label>
                <input
                  className="form-control"
                  name="date"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>

              <FormGroup>
                <label>Almacen Origen Id:</label>
                <input
                  className="form-control"
                  name="originWarehouseId"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Almacen Destino Id:</label>
                <input
                  className="form-control"
                  name="targetWarehouseId"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <label>Tipo:</label>
                <input
                  className="form-control"
                  name="type"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Compañia:</label>
                <input
                  className="form-control"
                  name="companyId"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
  
              <FormGroup>
                <label>Id Empleado:</label>
                <input
                  className="form-control"
                  name="employeeId"
                  type="text"
                  onChange={this.handleChange}
                />
              </FormGroup>
  
              
  
              
            </ModalBody>
  
            <ModalFooter>
              <Button color="primary" onClick={() => this.create()}>
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