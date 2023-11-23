
import { useState, useRef } from 'react';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext()

  const onSubmit = async (ev) => {
    ev.preventDefault()
    ev.stopPropagation();

    const setRef = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    setErrors(null)
    axiosClient.post('/login', setRef)
      .then(({ data }) => {
        setUser(data.user)
        setToken(data.token)
        window.location.reload(false);
      })
      .catch(err => {
        const response = err.response
        if (response && response.status == 422) {
          setErrors(response.data.errors)
        } else {
          setErrors({
            email: [response.data.message]
          })
        }
      })
  }

  return (
    <div>
      <Container>
        <Row><Col><br /><br /><br /></Col></Row>
        <Row className="justify-content-md-center">
          <Col></Col>
          <Col md="auto">
            <Form  id="formpost" className="p-3 mb-2 bg-primary-subtle text-emphasis-primary" spellCheck="false">
              <h1 className="title">Loggin</h1>
              {errors &&
                <div className="alert alert-warning">
                  {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                  ))}
                </div>
              }
              <Form.Group className="mb-3" >
                <Form.Control ref={emailRef} type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3" >
                <Form.Control ref={passwordRef} type="password" placeholder="Password" autoComplete="off" />
              </Form.Group>

              <Button onClick={onSubmit} type="submit" variant="primary">
                Submit
              </Button>
              <p className="message">Not registered? <Link to="/signup">Create account</Link></p>
            </Form>

          </Col>
          <Col></Col>
        </Row>
      </Container>

    </div>
  )
}
