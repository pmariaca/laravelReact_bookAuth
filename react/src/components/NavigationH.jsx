import { Container, Navbar } from 'react-bootstrap';

export function NavigationH(props) {

  return (
    <Navbar className="bg-body-tertiary">
      <Container className=" bg-primary-subtle text-emphasis-primary" >
        <Navbar.Brand href="#">
          <img src="/tree-with-many-leaves_25267.png"
            alt="image" width="40px" height="40px"
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {props.name} <a onClick={props.onAction} className="btn-logout" href="#">{props.title}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
