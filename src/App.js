import { Modal } from "antd";
import axios from "axios";
import isEmpty from "is-empty";
import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import {
  FiAirplay,
  FiArrowRight,
  FiAtSign,
  FiPhone,
  FiUser,
} from "react-icons/fi";

// ✅ Simulación de mesas disponibles con propiedad correcta
const mesasDisponibles = [
  { id_mesa: 1, mesa: "Mesa 1" },
  { id_mesa: 2, mesa: "Mesa 2" },
  { id_mesa: 3, mesa: "Mesa 3" },
];

const Instance = axios.create({
  // baseURL: "https://dev.ordenfacil.org/",
  baseURL: "http://192.168.0.107:7585/",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

function App() {
  // por la url me pasan el id_empresa y opcional el id_mesa
  const urlParams = new URLSearchParams(window.location.search);
  const id_empresa = urlParams.get("id_empresa");
  const id_mesa = urlParams.get("id_mesa") || 0;
  const [Cliente, setCliente] = useState({
    id: 0,
    razonsocial: "",
    nombre: "",
    email: "",
    correo: "",
    direccion: "",
    telefono: "",
    ruc: "",
    id_mesa: id_mesa,
    id_empresa: id_empresa || 0,
    ciudad: "",
  });

  const limpiaCliente = () => {
    setCliente({
      id: 0,
      razonsocial: "",
      nombre: "",
      email: "",
      correo: "",
      direccion: "",
      telefono: "",
      ruc: "",
      id_mesa: id_mesa,
      id_empresa: Number(id_empresa) || 0,
      ciudad: "",
    });
  };

  const ConsultarSIRUC = async (ruc) => {
    try {
      const { data, status } = await Instance.post(`clientesConsultarRucSri`, {
        ruc: ruc,
      });
      console.log("🔍 Respuesta de SIRUC:", data);
      if (status === 200) {
        setCliente((prev) => ({
          ...prev,
          ruc: data.data[0].numeroRuc,
          nombre: data.data[0].razonSocial,
          razonsocial: data.data[0].razonSocial,
        }));
      }
    } catch (error) {
      console.error("❌ Error al consultar SIRUC:", error);
      Modal.error({
        title: "❌ Error al consultar SIRUC",
        content: "No se pudo obtener información del RUC/Cédula.",
      });
    }
  };

  const handleTextImput = async (e) => {
    const { name, value } = e.target;
    console.log("✍️ Cambiando campo:", name, "con valor:", value);
    setCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("🔍 Buscando cédula o RUC:", value);
    if (name === "ruc" && (value.length === 10 || value.length === 13)) {
      try {
        const { data, status } = await Instance.post("clientesBuscar", {
          buscar: value,
          id_empresa: Number(id_empresa) || 0,
          id_mesa: null,
        });
        console.log("🔍 Resultado de búsqueda:", data);
        if (status === 200 && data.status === 200) {
          limpiaCliente();
          setCliente((prev) => ({
            ...prev,
            ruc: data.data.ruc,
            nombre: data.data.nombre,
            razonsocial: data.data.razonsocial || data.data.nombre,
            cedula: data.data.cedula,
            direccion: data.data.direccion,
            email: data.data.email,
            telefono: data.data.telefono,
            ciudad: data.data.ciudad || "",
          }));
        } else {
          await ConsultarSIRUC(value);
        }
      } catch (error) {
        console.error("❌ Error al buscar cédula:", error);
      }
    }
  };

  const btn_login_on_click = async () => {
    console.log("🔍 Enviando datos del cliente:", Cliente);
    if (
      !isEmpty(Cliente.ruc) &&
      !isEmpty(Cliente.razonsocial) &&
      !isEmpty(Cliente.direccion) &&
      !isEmpty(Cliente.telefono)
    ) {
      const info = {
        id: Cliente.id,
        ruc: Cliente.ruc,
        nombre: Cliente.nombre.toUpperCase(),
        razonsocial: Cliente.razonsocial.toUpperCase(),
        direccion: Cliente.direccion,
        telefono: Cliente.telefono,
        celular: Cliente.telefono,
        email: Cliente.email,
        id_mesa: Number(Cliente.id_mesa),
        id_empresa: Number(Cliente.id_empresa),
        ciudad: Cliente.ciudad || "",
      };

      try {
        const { data } = await Instance.post(
          "clientesRegistrarMovil",
          info
        );
        console.log("✅ Respuesta del servidor:", data);
        if (data.status === 400) {
          Modal.success({ title: "✅ Datos actualizados correctamente" });
        } else {
          Modal.success({ title: "✅ Datos guardados correctamente" });
        }
        limpiaCliente();
      } catch (error) {
        Modal.error({
          title: "❌ Error al guardar datos",
          content: error.message,
        });
      }
    } else {
      Modal.error({
        title: "❗ Datos incompletos",
        content:
          "Llenar todos los campos. La cédula debe tener 10 o 13 dígitos.",
      });
    }
  };

  return (
    <Container>
      <Row className="vh-100 justify-content-center align-items-center">
        <Col lg={6} md={8} sm={12} className="p-4 shadow-lg rounded bg-white">
          <h4 className="mb-3 text-center fw-bold">
            📄 Registro de Datos para Facturación
          </h4>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Cédula / RUC</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FiAirplay />
                </InputGroup.Text>
                <FormControl
                  name="ruc"
                  placeholder="Ej: 0102030405"
                  value={Cliente.ruc}
                  onChange={handleTextImput}
                  maxLength={13}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Nombres</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FiUser />
                </InputGroup.Text>
                <FormControl
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={Cliente.nombre}
                  onChange={handleTextImput}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FiAtSign />
                </InputGroup.Text>
                <FormControl
                  name="email"
                  placeholder="Ej: correo@email.com"
                  value={Cliente.email}
                  onChange={handleTextImput}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FiPhone />
                </InputGroup.Text>
                <FormControl
                  name="telefono"
                  placeholder="Ej: 0991234567"
                  value={Cliente.telefono}
                  onChange={handleTextImput}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Dirección</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FiArrowRight />
                </InputGroup.Text>
                <FormControl
                  name="direccion"
                  placeholder="Ej: Av. Central 123"
                  value={Cliente.direccion}
                  onChange={handleTextImput}
                />
              </InputGroup>
            </Form.Group>

            {/* Ciudad */}
            <Form.Group className="mb-2">
              <Form.Label>Ciudad</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FiAirplay />
                </InputGroup.Text>
                <FormControl
                  name="ciudad"
                  placeholder="Ej: Quito"
                  value={Cliente.ciudad}
                  onChange={handleTextImput}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Mesa</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FiAirplay />
                </InputGroup.Text>
                <Form.Select
                  name="id_mesa"
                  value={String(Cliente.id_mesa)}
                  onChange={handleTextImput}
                >
                  <option value="0" disabled>
                    Seleccione una mesa...
                  </option>
                  {mesasDisponibles.map((mesa) => (
                    <option key={mesa.id_mesa} value={mesa.id_mesa}>
                      {mesa.mesa}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <Button
              variant="primary"
              className="w-100"
              onClick={btn_login_on_click}
            >
              {Cliente.id !== 0 ? "Actualizar" : "Registrar"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
