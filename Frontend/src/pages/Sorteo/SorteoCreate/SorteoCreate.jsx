import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import RequiredLabel from "../../../components/RequiredLabel";
import Header from "../../../components/Header";
import useAuthentication from "../../../../hooks/useAuthentication";
import { useSorteoForm } from "./SorteoCreate";

const FormSorteo = () => {
    // Validar que el usuario esté autenticado
    useAuthentication(true);

    const {
        validated,
        nombre,
        fecha,
        setNombre,
        setFecha,
        handleSubmit,
        handleCancel
    } = useSorteoForm();

    // Obtener la fecha mínima (hoy)
    const obtenerFechaMinima = () => {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2">
                    <Col md={9} xl={6}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row>
                                        <Col>
                                            <h1>Crear Sorteo</h1>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtNombre">Nombre del Sorteo</RequiredLabel>
                                                <FormControl 
                                                    id="txtNombre" 
                                                    required 
                                                    maxLength={100} 
                                                    type="text" 
                                                    value={nombre} 
                                                    onChange={(e) => setNombre(e.target.value)} 
                                                />
                                                <FormControl.Feedback type="invalid">
                                                    El nombre es obligatorio
                                                </FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col>
                                            <FormGroup>
                                                <FormLabel htmlFor="txtFecha">Fecha de Sorteo</FormLabel>
                                                <FormControl 
                                                    id="txtFecha" 
                                                    type="date" 
                                                    min={obtenerFechaMinima()}
                                                    value={fecha} 
                                                    onChange={(e) => setFecha(e.target.value)} 
                                                />
                                                <Form.Text className="text-muted">
                                                    Selecciona una fecha a partir de hoy
                                                </Form.Text>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <div className="mt-3">
                                        <Button variant="primary" type="submit">Guardar</Button>
                                        <Button variant="secondary" className="ms-2" onClick={handleCancel}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FormSorteo;