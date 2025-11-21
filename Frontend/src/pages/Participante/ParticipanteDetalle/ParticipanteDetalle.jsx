
import { 
    Container, 
    Row, 
    Col, 
    Card, 
    Button, 
    ListGroup, 
    Spinner, 
    Alert,
    Modal,
    Form,
    FormControl,
    Badge
} from "react-bootstrap";
import Header from "../../../components/Header";
import { useParticipanteDetalle } from "./ParticipanteDetalle";

const DetalleParticipante = () => {
    
    const {
        participante,
        participanteAsignado,
        loading,
        error,
        showAddWishlist,
        setShowAddWishlist,
        nuevoDeseo,
        setNuevoDeseo,
        handleAddWishlist
    } = useParticipanteDetalle();

    if (loading) {
        return (
            <>
                <Header />
                <Container className="text-center mt-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <Container className="mt-4">
                    <Alert variant="danger">
                        <strong>Error:</strong> {error}
                    </Alert>
                </Container>
            </>
        );
    }

    if (!participante) {
        return (
            <>
                <Header />
                <Container className="mt-4">
                    <Alert variant="warning">
                        No se encontró el participante
                    </Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="my-4">
                <Row className="mb-4">
                    <Col>
                        <h2>Mi Participación en el Sorteo</h2>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Card className="shadow-sm mb-3">
                            <Card.Header as="h5">
                                Mis Datos
                            </Card.Header>
                            <Card.Body>
                                <p><strong>Nombre:</strong> {participante.nombre}</p>
                                <p><strong>Identificador:</strong> <Badge bg="secondary">{participante.identificadorUnico}</Badge></p>
                                <p><strong>Link personal:</strong><br/>
                                <a href={`http://localhost:5173/participantes/${participante.linkParticipante}`} target="_blank" rel="noopener noreferrer">
                                    <code className="text-break">{participante.linkParticipante}</code>
                                </a>
                                </p>
                            </Card.Body>
                        </Card>

                        <Card className="shadow-sm">
                            <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                                <span>Mi Lista de Deseos</span>
                                <Button 
                                    size="sm" 
                                    variant="primary" 
                                    onClick={() => setShowAddWishlist(true)}
                                >
                                    + Agregar
                                </Button>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {!participante.deseos || participante.deseos.length === 0 ? (
                                    <ListGroup.Item>
                                        No tienes deseos agregados aún. ¡Agrega algunos!
                                    </ListGroup.Item>
                                ) : (
                                    participante.deseos.map((deseo, index) => (
                                        <ListGroup.Item key={deseo.id || index}>
                                            {deseo.wishlist}
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="shadow-sm">
                            <Card.Header as="h5" className="bg-success text-white">
                                Tu Amigo Secreto
                            </Card.Header>
                            {participanteAsignado ? (
                                <>
                                    <Card.Body>
                                        <h4>{participanteAsignado.nombre}</h4>
                                        <p className="text-muted">
                                            Esta es la persona a quien debes hacerle un regalo
                                        </p>
                                    </Card.Body>
                                    <Card.Header as="h6">
                                        Lista de Deseos
                                    </Card.Header>
                                    <ListGroup variant="flush">
                                        {!participanteAsignado.deseos || participanteAsignado.deseos.length === 0 ? (
                                            <ListGroup.Item>
                                                {participanteAsignado.nombre} aún no ha agregado deseos
                                            </ListGroup.Item>
                                        ) : (
                                            participanteAsignado.deseos.map((deseo, index) => (
                                                <ListGroup.Item key={deseo.id || index}>
                                                    ✨ {deseo.wishlist}
                                                </ListGroup.Item>
                                            ))
                                        )}
                                    </ListGroup>
                                </>
                            ) : (
                                <Card.Body>
                                    <Alert variant="info">
                                        El sorteo aún no se ha realizado. Una vez que el administrador realice el sorteo, podrás ver a quién le tocaste.
                                    </Alert>
                                </Card.Body>
                            )}
                        </Card>
                    </Col>
                </Row>

                <Modal show={showAddWishlist} onHide={() => setShowAddWishlist(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Deseo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>¿Qué te gustaría recibir?</Form.Label>
                            <FormControl 
                                as="textarea"
                                rows={3}
                                value={nuevoDeseo}
                                onChange={(e) => setNuevoDeseo(e.target.value)}
                                placeholder="Ejemplo: Un libro de ciencia ficción, ropa talla M, etc. Describe tu deseo palabra por palabra para que tu amigo secreto lo encuentre fácilmente."
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddWishlist(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleAddWishlist}>
                            Agregar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default DetalleParticipante;