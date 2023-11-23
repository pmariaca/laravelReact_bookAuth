
import { useState, useRef } from 'react';
import axiosClient from '../../axios-client';
import { useStateContext } from '../../contexts/ContextProvider';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext()

  const onSubmit = (ev) => {
    ev.preventDefault()

    const setRef = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value
    }
    axiosClient.post('/signup', setRef)
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
            <Form id="formpost" className="p-3 mb-2 bg-primary-subtle text-emphasis-primary" spellCheck="false">
              <h1 className="title">Create account</h1>
              {errors &&
                <div className="alert alert-warning">
                  {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                  ))}
                </div>
              }

              <Form.Group className="mb-3" >
                <Form.Control ref={nameRef} type="text" placeholder="Full Name" required />
              </Form.Group>

              <Form.Group className="mb-3" >
                <Form.Control ref={emailRef} type="email" placeholder="Enter email" required />
              </Form.Group>

              <Form.Group className="mb-3" >
                <Form.Control ref={passwordRef} type="password" placeholder="Password" autoComplete="off" required />
              </Form.Group>

              <Form.Group className="mb-3" >
                <Form.Control ref={passwordConfirmationRef} type="password" placeholder="Repeat Password" autoComplete="off" required />
              </Form.Group>

              <Button variant="primary" onClick={onSubmit}>
                Submit
              </Button>
              <p className="message">Already registered? <Link to="/login">Sign in </Link></p>
            </Form>

          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  )
}
