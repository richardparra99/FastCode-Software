import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import RequiredLabel from "../../../components/RequiredLabel";
import Header from "../../../components/Header";
import { useRegisterForm } from "./FormRegister";

const FormRegister = () => {
    const {
        validated,
        username,
        password,
        nombre,
        setUsername,
        setPassword,
        setNombre,
        handleSubmit,
        handleCancel
    } = useRegisterForm();

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2">
                    <Col md={6} xl={4}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row>
                                        <Col>
                                            <h1>Registro</h1>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtNombre">Nombre</RequiredLabel>
                                                <FormControl id="txtNombre" required maxLength={100} type="text" 
                                                value={nombre} 
                                                onChange={(e) => {setNombre(e.target.value);}} />
                                                <FormControl.Feedback type="invalid">El nombre es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtUsername">Username</RequiredLabel>
                                                <FormControl id="txtUsername" required maxLength={100} type="text" value={username} onChange={(e) => {
                                                    setUsername(e.target.value);
                                                }} />
                                                <FormControl.Feedback type="invalid">El username es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtPassword">Password</RequiredLabel>
                                                <FormControl id="txtPassword" maxLength={100} required type="password" value={password} onChange={(e) => {
                                                    setPassword(e.target.value);
                                                }} />
                                                <FormControl.Feedback type="invalid">El password es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">Iniciar sesión</Button>
                                        <Button variant="secondary" className="ms-2" onClick={handleCancel}>Cancelar</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FormRegister;