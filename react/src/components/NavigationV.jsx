import Nav from 'react-bootstrap/Nav';
import { Link } from "react-router-dom";

export function NavigationV() {
  return (
    <Nav defaultActiveKey="/" className="flex-sm-column bg-primary-subtle p-2 text-white"  id="divNavV">
      <Link to="/dashboard" className="nav-link" >dashboard</Link>
      <Link to="/books" className="nav-link" >Books</Link>
    </Nav>
  );
}
