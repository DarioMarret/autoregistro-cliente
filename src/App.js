import { useState, useEffect } from "react"
import { Col, Container, Row, Form, Button, InputGroup, FormControl, Modal as ModalSpinner } from "react-bootstrap";
import {  FiAirplay, FiUser, FiUsers, FiAtSign, FiPhone, FiArrowRight, FiBriefcase } from "react-icons/fi";
import axios from "axios"
import { Modal } from "antd"

function App() {
  const [Cliente, setCliente] = useState({
    id:"",
    razon_social:"",
    nombre:"",
    email:"",
    correo:"",
    direccion:"",
    telefono:"",
    cedula:""
  })

  function limpiaCliente(){
    setCliente({
      id:"",
      razon_social:"",
      nombre:"",
      email:"",
      correo:"",
      direccion:"",
      telefono:"",
      cedula:""
    })
  }


  const handleTextImput = async(e) => {
    try {
      if(e.target.value.length == 10 || e.target.value.length == 13){
        setCliente({
          ...Cliente,
          [e.target.name]:e.target.value
        })
      }
    } catch (error) {
      console.log(error)      
    }
  }

  const btn_login_on_click =async()=>{

    if(Cliente.cedula != "" && Cliente.nombre != "" && Cliente.direccion != "" && Cliente.telefono != ""){
      let info = {
        id:Cliente.id,
        cedula:Cliente.cedula,
        nombre:Cliente.nombre.toLocaleUpperCase(),
        direccion:Cliente.direccion,
        telefono:Cliente.telefono,
        razon_social:Cliente.nombre.toLocaleUpperCase(),
        email:Cliente.email
      }
      const { data } = await axios.post('https://codigomarret.online/facturacion/cedula_autoregistri',info)

      if (data.success == false && data.message == "La cedula ya se encuentra registrada") {
        await axios.put("https://codigomarret.online/facturacion/cedula_refrescar",info)
        limpiaCliente()
        Modal.warn({
          title:'Soy Cliente',
          content:'Datos actualizados correctamente'
        })
      }else{
        limpiaCliente()
        Modal.success({
          title:'Soy Cliente',
          content:'Datos guardados correctamente'
        })
      }
    }else{
      Modal.error({
        title:'Soy Cliente',
        content:'Datos incompletos llenar todos los campos recuerde que el campo cedula debe tener 10 0 13 digitos'
      })

    }
  }
  return (
      <Container>

          <Row className="m-0 vh-100 justify-content-center align-items-center">
              <Col lg={5} md={6} sm={12}
                  className="p-5 m-auto text-center shadow-lg rounded-lg "
              >
                  {/* <h3 className="text-center">{empresa}</h3> */}
                  <i>Registrar datos para la emisión de su factura electronica </i>
                  <Form>
                      <Form.Label className="d-flex text-start">Cedula/Ruc</Form.Label>
                      <InputGroup className="mb-1">
                          <InputGroup.Text id="basic-addon1"><FiAirplay /></InputGroup.Text>
                          <FormControl
                              placeholder="Ingresar cedula o ruc"
                              name="cedula"
                              value={Cliente.cedula}
                              onChange={handleTextImput}
                          />
                      </InputGroup>

                      <Form.Label className="d-flex text-start">Nombres</Form.Label>
                      <InputGroup className="mb-1">
                          <InputGroup.Text id="basic-addon2"><FiUser /></InputGroup.Text>
                          <FormControl
                              placeholder="Ingresar nombres completo"
                              type="text"
                              name="nombre"
                              value={Cliente.nombre}
                              onChange={handleTextImput}
                          />
                      </InputGroup>

                      <Form.Label className="d-flex text-start">Email</Form.Label>
                      <InputGroup className="mb-1">
                      <InputGroup.Text id="basic-addon2"><FiAtSign /></InputGroup.Text>
                          <FormControl
                              placeholder="Ingresar email"
                              type="text"
                              name="email"
                              value={Cliente.email}
                              onChange={handleTextImput}
                          />
                      </InputGroup>

                      <Form.Label className="d-flex text-start">Telefono</Form.Label>
                      <InputGroup className="mb-1">
                          <InputGroup.Text id="basic-addon2"><FiPhone /></InputGroup.Text>
                          <FormControl
                              placeholder="Ingresar telefono"
                              type="text"
                              value={Cliente.telefono}
                              name="telefono"
                              onChange={handleTextImput}
                          />
                      </InputGroup>

                      <Form.Label className="d-flex text-start">Direccion</Form.Label>
                      <InputGroup className="mb-1">
                          <InputGroup.Text id="basic-addon2"><FiArrowRight /></InputGroup.Text>
                          <FormControl
                              placeholder="ingresar una direccion"
                              type="text"
                              name="direccion"
                              value={Cliente.direccion}
                              onChange={handleTextImput}
                          />
                      </InputGroup>
                      <br />
                      <Button
                          variant="primary btn-block"
                          type="button"
                          className="form-control"
                          onClick={()=>btn_login_on_click()}
                      >
                          {Cliente.id != "" ? 'Actualizar' : 'Registrar'}
                      </Button>
                  </Form>
              </Col>
          </Row>
      </Container>
  )
}

export default App;
