import { useEffect, useState } from "react"
import axiosClient from "../axios-client"
import { Link } from "react-router-dom";
import { Table, Button } from 'react-bootstrap';
import toast, { Toaster } from "react-hot-toast"

export default function Book() {
  const [books, setBook] = useState([])

  useEffect(() => {
    getBooks()
  }, []);

  const getBooks = () => {
    axiosClient.get('/books')
      .then(({ data }) => {
        updateState(data.data)
      })
      .catch((err) => {
      })
  }

  const onDelete = (u) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return
    }
    axiosClient.delete(`/books/${u.id}`)
      .then(() => {
        toast.success('Deleted Book')
        getBooks()
      })
  }

  function updateState(data) {
    const newState = data.map(obj => {
      obj.image_url = obj.image_url==null ?'no':'yes'
      obj.isbn = obj.isbn.substring(0, 3) + '-' + obj.isbn.substring(3, 4)
        + '-' + obj.isbn.substring(4, 9) + '-' + obj.isbn.substring(9, 12) + '-' + obj.isbn.substring(12, 13)
      obj.description = obj.description.substring(0, 22) + ' ...'
      var gr = []
      obj.genres.map(obj2 => { gr.push(obj2.genre) })
      obj['strgenre'] = gr.join(', ')
      var at = []
      obj.authors.map(obj2 => { at.push(obj2.name + ' ' + obj2.name2 + ' ' + obj2.name3) })
      obj['strauthor'] = at.join(', ')
      return obj;
    });
    setBook(newState)
  };

  return (
    <div>
      <h3>Books</h3>
      <div align="right">
        <Link to="/books/new" className="btn btn-success btn-sm">Add new</Link>
      </div>
      <br/>
      <Table  responsive striped >
        <thead>
          <tr  className="table-dark">
            {/* <th>Id</th> */}
            <th width="13%">Title</th>
            <th>Description</th>
            {/* <th width="20%">isbn</th> */}
            <th width="13%">Genre</th>
            <th width="20%">Author/s</th>
            <th width="10%">Published</th>
            <th width="10%">Cover</th>
            <th></th><th></th>
          </tr>
        </thead>
        <tbody>
          {books && books.map(u => (
            <tr key={u.id}>
              {/* <td>{u.id}</td> */}
              <td>{u.title}</td>
              <td>{u.description}</td>
              {/* <td>{u.isbn}</td> */}
              <td>{u.strgenre}</td>
              <td>{u.strauthor}</td>
              <td>{u.published_at}</td>
              <td>{u.image_url}</td>
              <td>
                <Link to={'/books/' + u.id} className="btn btn-primary btn-sm btnmin">Edit</Link>
              </td>
              <td>
                <Button variant="danger btnmin" size="sm" onClick={ev => onDelete(u)} >Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

  )
}
