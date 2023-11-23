import { useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function PreviewImage(props) {
  const { file, setFile, fileDataURL, setFileDataURL } = props

  const changeHandler = (e) => {
    e.preventDefault()
    const file = e.target.files[0];
    setFile(file);
  }
  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }
  }, [file]);

  const removeSelImage = (e) => {
    e.preventDefault()
    setFileDataURL(null)
    setFile(null)
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col className="mb-3">
            {fileDataURL && (
              <div className="imgDiv">
                <div className="imgPrv">
                  {<img src={fileDataURL} alt="preview" className="image" />}
                  <Button variant="dark" onClick={removeSelImage} >
                    Remove image
                  </Button>
                </div>
              </div>
            )}
          </Col>

          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Browse image</Form.Label>
              <Form.Control type="file" size="sm"
                accept='image/*, .png, .jpg, .jpeg'
                onChange={changeHandler}
              />
            </Form.Group>
          </Col>
        </Row>
      </Container>

    </>
  );
}
