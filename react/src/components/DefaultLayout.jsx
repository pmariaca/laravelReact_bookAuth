
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client.js"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { NavigationH } from "./NavigationH.jsx";
import { NavigationV } from "./NavigationV.jsx";

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext()

  if (!token) {
    return <Navigate to="/login" />
  }

  const onLogout = (ev) => {
    ev.preventDefault()
    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
        window.location.reload();
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data)
      })
  }, []);

  return (
    <div id="defaultLayout" className="p-3 mb-2">
      <Container className="">

        <Row className="justify-content-md-center">
          <Col>
            <NavigationH
              name={user.name}
              title="Logout"
              onAction={onLogout}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={2}> <NavigationV /></Col>
          <Col >
            <div className="content">
              <main>
                <Outlet />
              </main>
            </div>
          </Col>
        </Row>

      </Container>
    </div>
  )
}
