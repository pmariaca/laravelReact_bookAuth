import React, { useEffect, useState } from "react"
import axiosClient from "../axios-client"
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"
import Select from 'react-select'
import { PreviewImage } from "../components/PreviewImage";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function BookForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selgenre, setSelgenre] = useState([])
  const [selauthor, setSelauthor] = useState([]);
  const [allgenre, setAllgenre] = useState([{
    id: null,
    genre: ''
  }])
  const [allauthor, setAllauthor] = useState([{
    id: null,
    strname: '',
  }])
  const [focused, setFocused] = useState(false)
  const [errors, setErrors] = useState(null);
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [book, setBook] = useState({
    id: null,
    title: '',
    description: '',
    isbn: '',
  })

  useEffect(() => {
    if (id) {
      axiosClient.get(`/books/${id}`)
        .then(({ data }) => {
          setBook(data.data)
          setAllgenre(data.allgenres)
          setAllauthor(createArr(data.allauthors))
          setSelauthor(createSelect(data.data.authors, data.allauthors, 1))
          setSelgenre(createSelect(data.data.genres, data.allgenres, 2))

          let baseUrl = axiosClient.defaults.baseURL
          baseUrl = baseUrl.replace('/api','')
          if (data.data.image_url != '/storage/') {
            setFileDataURL(baseUrl + data.data.image_url)
          }
        })
        .catch(() => {
        })
    } else {
      axiosClient.get(`/books/0`)
        .then(({ data }) => {
          setAllgenre(data.allgenres)
          setAllauthor(createArr(data.allauthors))
        })
        .catch((err) => {
        })
    }
  }, []);

  function createArr(data) {
    const newState = data.map(obj => {
      return { 'id': obj.id, 'strname': obj.name + ' ' + obj.name2 + ' ' + obj.name3 }
    });
    return newState
  }

  function createSelect(selArr, allArr, flg) {
    const arr = []
    selArr.forEach(element => {
      allArr.some(u => {
        if (element.id == u.id) {
          if (flg == 1) {
            arr.push({ "value": u.id, "label": u.name + ' ' + u.name2 + ' ' + u.name3 })
          } else {
            arr.push({ "value": u.id, "label": u.genre })
          }
        }
      })
    });
    return arr
  }

  const onSubmit = (e) => {
    e.preventDefault()

    setErrors(null)
    let formData = new FormData();
    formData.append('title', book.title);
    formData.append('description', book.description);
    formData.append('isbn', book.isbn);

    if (book.published_at != undefined && book.published_at != 'undefined') {
      formData.append('published_at', book.published_at);
    }

    selauthor.forEach((item) => formData.append("authors[]", item.value))
    selgenre.forEach((item) => formData.append("genres[]", item.value))

    if (fileDataURL === null) {
      formData.append('image_url', '');
    }
    if (file) {
      formData.append('image_url', file);
    }

    if (book.id) {
      formData.append('id', book.id);
      axiosClient.put(`/books/${book.id}`, formData)
        .then(({ data }) => {
          toast.success('Updated Book')
          navigate('/books')
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })

    } else {
      axiosClient.post(`/books`, formData)
        .then(({ data }) => {
          toast.success('Created Book')
          navigate('/books')
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  const handleChangeIsbn = e => {
    const aja = e.target.value
    isNaN(e.target.value) ? e.target.value = aja : setBook({ ...book, isbn: e.target.value })
  };

  const handleChangeSelectA = (selauthor) => {
    setSelauthor(selauthor)
  };

  const handleChangeSelectG = (selgenre) => {
    setSelgenre(selgenre)
  };

  return (
    <>
      {book.id && <h3>Update book: {book.title}</h3>}
      {!book.id && <h3>New book</h3>}

      <Form id="formbook" className="p-3 mb-2 bg-primary-subtle text-emphasis-primary" spellCheck="false" >

        {errors &&
          <div className="alert alert-warning">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }

        <Form.Group controlId="title" className="mb-3" >
          <Form.Label >Title</Form.Label>
          <Form.Control type="text"
            required
            onBlur={e => setFocused(true)}
            focused={focused.toString()}
            value={book.title}
            onChange={e => setBook({ ...book, title: e.target.value })}
          />
          <span className="isvalid">Required</span>
        </Form.Group>

        <Form.Group controlId="isbn" className="mb-3" >
          <Form.Label>Isbn</Form.Label>&nbsp;&nbsp;&nbsp;
          <Form.Text id="passwordHelpBlock" muted>
            Only 13 numbers
          </Form.Text>
          <Form.Control type="text"
            required
            autoComplete="off"
            onBlur={e => setFocused(true)}
            focused={focused.toString()}
            value={book.isbn}
            maxLength="13"
            onChange={handleChangeIsbn}
          />
          <span className="isvalid">Required</span>
        </Form.Group>

        <FloatingLabel controlId="description" label="Descripcion">
          <Form.Control
            required
            onBlur={e => setFocused(true)}
            focused={focused.toString()}
            as="textarea"
            placeholder="Description"
            style={{ height: '100px' }}
            value={book.description}
            onChange={e => setBook({ ...book, description: e.target.value })}
          />
          <span className="isvalid">Required</span>
        </FloatingLabel>

        <Row>
          <Col sm={6}>
            <Form.Group controlId="genre"  >
              <Form.Label >Genre</Form.Label>
              <Select
                className="select-wrapper"
                required="true"
                isMulti="true"
                value={selgenre}
                onChange={handleChangeSelectG}
                options={allgenre && allgenre.map(u => ({ value: u.id, label: u.genre }))}
              />
              {selgenre.length < 1 && <span className="isvalid2">You must choose a value</span>}
            </Form.Group>
          </Col>
          <Col >
            <Form.Group controlId="author" >
              <Form.Label >Author</Form.Label>
              <Select
                required="true"
                isMulti="true"
                value={selauthor}
                onChange={handleChangeSelectA}
                options={allauthor && allauthor.map(u => ({ value: u.id, label: u.strname }))}
              />
              {selauthor.length < 1 && <span className="isvalid2">You must choose a value</span>}
            </Form.Group>
          </Col>
        </Row>

        <Row >
        <Col></Col>
          <Col>
            <Form.Group controlId="published_at">
              <Form.Label >Published date</Form.Label>
              <Form.Control
                type="date"
                name="published_at"
                defaultValue={book.published_at}
                onChange={ev => setBook({ ...book, published_at: ev.target.value })}
              />
            </Form.Group>
          </Col>

        </Row>

        <PreviewImage
              file={file}
              setFile={setFile}
              fileDataURL={fileDataURL}
              setFileDataURL={setFileDataURL}
            />

        <div align="right">
          <br />
          <Button className="btn btn-primary btn-sm " onClick={onSubmit}>Save</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link to="/books" className="btn btn-secondary btn-sm ">Cancel</Link>
        </div>
      </Form>

    </>
  )
}
