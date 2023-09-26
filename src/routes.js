const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    // ADD BOOK
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    // GET BOOKS
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    // DETAIL BOOK
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    // EDIT BOOK
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    // DELETE BOOK
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
