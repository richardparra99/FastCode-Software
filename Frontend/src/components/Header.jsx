import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/TokenUtilities";
import useAuthentication from "../../hooks/useAuthentication";

const Header = () => {
    const { doLogout, userEmail } = useAuthentication();
    const onLogoutClick = () => {
        doLogout();
    }
    const token = getAccessToken();
    return (
        <Navbar bg="primary" data-bs-theme="dark" expand="lg" >
            <Container>
                <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {token ? <>
                            <Link className="nav-link" to="/">Home</Link>
                            <NavDropdown title="Docentes" id="basic-nav-dropdown">
                                <Link className="dropdown-item" to="/">
                                    Lista de docentes
                                </Link>
                                <Link className="dropdown-item" to="/docentes/create">Crear docente</Link>
                            </NavDropdown>
                            <NavDropdown title={userEmail} id="logout-dropdown">
                                <button className="dropdown-item" onClick={onLogoutClick}>
                                    Cerrar sesión
                                </button>
                            </NavDropdown>

                        </> : <>
                            <Link className="nav-link" to="/login">Iniciar sesión</Link>
                            <Link className="nav-link" to="/register">Registrarse</Link>
                        </>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;