import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Spinner, Alert, Stack, Badge, Modal, Form } from "react-bootstrap";
import Header from "../../../components/Header";
import { useSorteoDetalle } from "./SorteoDetalle";

const DetalleSorteo = () => {
    const navigate = useNavigate();

    const {
        username,
        sorteo,
        loading,
        error,
        shareLink,
        handleCopyLink,
        showShare,
        setShowShare,
        copied,
        handleHabilitar,
        handleDeshabilitar,
        handleSortear,
        handleInscribirse,
        showLogin,
        setShowLogin,
        codigo,
        setCodigo,
        participanteData,
        handleVerAsignacion,
        handleLoginSubmit,
    } = useSorteoDetalle();

    const isOwner = (username !== "");

    console.log("DATOS", sorteo);

    
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "Fecha no definida";
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Col className="text-center mt-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </Col>
            );
        }

        if (error) {
            return (
                <Col>
                    <Alert variant="danger">
                        <strong>Error:</strong> {error}
                    </Alert>
                </Col>
            );
        }

        if (!sorteo) {
            return null;
        }

        const fecha = formatearFecha(sorteo.fecha);
        const creador = sorteo.usuario;

        // Vista para NO propietarios
        if (!isOwner) {
            return (
                <>
                    <Col md={5} lg={4}>
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <Card.Title as="h3">{sorteo.nombre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Creado por: {creador}
                                </Card.Subtitle>
                                <hr />
                                <p><strong>Fecha:</strong> {fecha}</p>

                                <Stack gap={2} className="mt-4">
                                    <Button variant="primary" onClick={handleInscribirse}>
                                        Inscribirse al sorteo
                                    </Button>
                                    <Button variant="outline-primary" onClick={handleVerAsignacion}>
                                        Ver mi asignación
                                    </Button>
                                </Stack>

                                {participanteData && (
                                    <Card className="mt-3 shadow-sm">
                                        <Card.Body>
                                            <h5>Tu asignación:</h5>
                                            {participanteData.participanteAsignado ? (
                                                <>
                                                    <p className="mb-1"><strong>{participanteData.participanteAsignado.nombre}</strong></p>
                                                    {participanteData.participanteAsignado.deseos?.length > 0 && (
                                                        <div className="mt-2">
                                                            <small className="text-muted">Lista de deseos:</small>
                                                            <ul className="mt-1">
                                                                {participanteData.participanteAsignado.deseos.map((d, i) => (
                                                                    <li key={i}><small>{d.wishlist}</small></li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-muted">Aún no se ha realizado el sorteo.</p>
                                            )}
                                            <div>Ver detalles <a href={`/participantes/${participanteData.linkParticipante}`} target="_blank" rel="noopener noreferrer">aquí</a></div>
                                        </Card.Body>
                                    </Card>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={7} lg={8}>
                        <Card className="shadow-sm">
                            <Card.Header as="h5">
                                Participantes ({sorteo.participantes?.length || 0})
                            </Card.Header>
                            <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {!sorteo.participantes || sorteo.participantes.length === 0 ? (
                                    <ListGroup.Item>
                                        Todavía no hay participantes inscritos.
                                    </ListGroup.Item>
                                ) : (
                                    sorteo.participantes.map((participante) => (
                                        <ListGroup.Item key={participante.id}>
                                            <small>{participante.nombre || 'Nombre no registrado'}</small>
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </>
            );
        }

        // Vista para propietarios
        let estadoVariant = "secondary";
        if (sorteo.estado == true) estadoVariant = "success";
        if (sorteo.estado == false) estadoVariant = "primary";

        return (
            <>
                <Col md={5} lg={4}>
                    <Card className="shadow-sm mb-3">
                        <Card.Body>
                            <Card.Title as="h3">{sorteo.nombre}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Creado por: {creador}
                            </Card.Subtitle>
                            <hr />
                            <p>
                                <strong>Estado:</strong> <Badge bg={estadoVariant} pill>{sorteo.estado}</Badge>
                            </p>
                            <p>
                                <strong>Fecha:</strong> {fecha}
                            </p>
                            <p>
                                
                                <strong>Link de invitación:</strong> <br />
                                <code className="text-break">{`${window.location.origin}/sorteo/${sorteo.link}`}</code>
                                
                            </p>

                            <h5 className="mt-4">Acciones de Administrador</h5>
                            <Stack gap={2}>
                                <Button variant="secondary" onClick={shareLink}>
                                    Compartir sorteo
                                </Button>

                                {sorteo.estado === true ? (
                                    <Button variant="warning" onClick={handleDeshabilitar}>
                                        Deshabilitar Sorteo
                                    </Button>
                                ) : (
                                    <Button variant="success" onClick={handleHabilitar} disabled={sorteo.estado === 'finalizado'}>
                                        Habilitar Sorteo
                                    </Button>
                                )}

                                <Button
                                    variant="primary"
                                    onClick={handleSortear}
                                    disabled={sorteo.estado == false}
                                >
                                    Realizar Sorteo
                                </Button>
                            </Stack>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7} lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">
                            Participantes ({sorteo.participantes?.length || 0})
                        </Card.Header>
                        <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {!sorteo.participantes || sorteo.participantes.length === 0 ? (
                                <ListGroup.Item>
                                    Todavía no hay participantes inscritos.
                                </ListGroup.Item>
                            ) : (
                                sorteo.participantes.map((participante) => (
                                    <ListGroup.Item key={participante.id}>
                                        <small>{participante.nombre}</small>
                                    </ListGroup.Item>
                                ))
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </>
        );
    };

    return (
        <>
            <Header />
            <Container className="my-4">
                {isOwner && (
                    <Row className="mb-3">
                        <Col>
                            <Button variant="outline-secondary" onClick={() => navigate('/')}>
                                &larr; Volver a Mis Sorteos
                            </Button>
                        </Col>
                    </Row>
                )}
                <Row>
                    {renderContent()}
                </Row>

                {/* Modal de compartir */}
                <Modal show={showShare} onHide={() => setShowShare(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Compartir Sorteo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Link de invitación</Form.Label>
                            <Form.Control readOnly value={sorteo ? `${window.location.origin}/sorteo/${sorteo.link}` : ""} />
                        </Form.Group>
                        <div className="mt-3 d-flex justify-content-end">
                            <Button variant="primary" onClick={handleCopyLink}>
                                {copied ? "✓ Copiado" : "Copiar link"}
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Modal de login participante */}
                <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Ingresa tu código</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Código de 6 dígitos</Form.Label>
                            <Form.Control
                                type="text"
                                maxLength={6}
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                placeholder="123456"
                            />
                        </Form.Group>
                        <div className="mt-3 d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowLogin(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={handleLoginSubmit}>
                                Ver asignación
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
};

export default DetalleSorteo;