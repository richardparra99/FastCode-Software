import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import RequiredLabel from "../../../components/RequiredLabel";
import Header from "../../../components/Header";
import { useLoginForm } from "./FormLogin"; 

const FormLogin = () => {
    const {
        validated,
        username,
        password,
        setUsername,
        setPassword,
        handleSubmit,
        handleCancel
    } = useLoginForm();

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2">
                    <Col md={6} xl={4}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}> {/* <--- USA HANDLER */}
                                    <Row>
                                        <Col>
                                            <h1>Iniciar sesión</h1>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtUsername">Username</RequiredLabel>
                                                <FormControl id="txtUsername" required maxLength={100} type="text"
                                                    value={username} // <-- USA ESTADO
                                                    onChange={(e) => setUsername(e.target.value)} // <-- USA HANDLER DE ESTADO
                                                />
                                                <FormControl.Feedback type="invalid">El username es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtPassword">Password</RequiredLabel>
                                                <FormControl id="txtPassword" maxLength={100} required type="password"
                                                    value={password} // <-- USA ESTADO
                                                    onChange={(e) => setPassword(e.target.value)} // <-- USA HANDLER DE ESTADO
                                                />
                                                <FormControl.Feedback type="invalid">El password es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">Iniciar sesión</Button>
                                        <Button variant="secondary" className="ms-2" onClick={handleCancel}> {/* <--- USA HANDLER */}
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
}

export default FormLogin;