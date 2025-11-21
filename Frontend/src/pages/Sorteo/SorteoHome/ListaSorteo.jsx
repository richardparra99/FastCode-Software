import { Button, Col, Container, Row, Card, Spinner, Stack } from "react-bootstrap";
import SearchTextField from "../../../components/SearchTextField";
import Header from "../../../components/Header";
import { useListaSorteos } from "./ListaSorteo";

const ListaSorteos = () => {
    const {
        listaSorteo,
        loading,
        handleEdit,
        handleView,
        handleDelete,
        handleCreate
    } = useListaSorteos();

    // Función para formatear la fecha
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

        if (listaSorteo.length === 0) {
            return (
                <Col>
                    <Card className="text-center p-4">
                        <Card.Body>
                            <Card.Title>No hay sorteos</Card.Title>
                            <Card.Text>
                                No has creado ningún sorteo todavía. ¡Empieza creando uno!
                            </Card.Text>
                            <Button variant="primary" onClick={handleCreate}>
                                + Crear mi primer Sorteo
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            );
        }

        return listaSorteo.map((sorteo) => {
            const key = sorteo.link;
            const nombre = sorteo.nombre || "Sorteo sin nombre";
            const fecha = formatearFecha(sorteo.fecha);

            return (
                <Col md={6} lg={4} key={key} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>{nombre}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                {fecha}
                            </Card.Subtitle>
                            <Stack direction="horizontal" gap={2} className="justify-content-end mt-3">
                                <Button size="sm" variant="outline-primary" onClick={() => handleView(key)}>
                                    Ver
                                </Button>
                                <Button size="sm" variant="outline-success" onClick={() => handleEdit(sorteo)}>
                                    Editar
                                </Button>
                                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(sorteo)}>
                                    Eliminar
                                </Button>
                            </Stack>
                        </Card.Body>
                    </Card>
                </Col>
            );
        });
    };

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row className="mb-3 align-items-center">
                    <Col>
                        <h2>Mis Sorteos</h2>
                    </Col>
                    <Col className="text-end">
                        <Button variant="primary" onClick={handleCreate}>
                            + Crear Nuevo Sorteo
                        </Button>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={5} lg={4}>
                        <SearchTextField onSearch={() => {}} placeholder="Buscar sorteo..."/>
                    </Col>
                </Row>

                <Row>
                    {renderContent()}
                </Row>
            </Container>
        </>
    );
};

export default ListaSorteos;