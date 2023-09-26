const {nanoid} = require('nanoid');
const {books} = require('./book');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finishedValue = pageCount === readPage ?? pageCount !== readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: finishedValue,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambah buku. readPage tidak boleh > pageCount',
    });
    response.code(400);
    return response;
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  };
};

const getAllBooksHandler = (request, h) => {
  const bookName = request.query.name;
  const bookReading = request.query.reading;
  const bookFinished = request.query.finished;

  if (bookName) {
    // QUERY = NAME
    const queryBookName = books.filter((book) => {
      return book.name.toLowerCase() === bookName.toLowerCase();
    });

    return {
      status: 'success',
      data: {
        books: queryBookName,
      },
    };
  } else if (bookReading) {
    // QUERY READING
    const queryBookReading = books.filter((book) => {
      return book.reading === (bookReading === '1');
    });

    return {
      status: 'success',
      data: {
        books: queryBookReading,
      },
    };
  } else if (bookFinished) {
    // QUERY FINISH = pageCount = readPage
    const queryBookFinished = books.filter((book) => {
      return book.finished === (bookFinished === '1');
    });

    return {
      status: 'success',
      data: {
        books: queryBookFinished,
      },
    };
  } else {
    const simpleBooks = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    return {
      status: 'success',
      data: {
        books: simpleBooks,
      },
    };
  }
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((n)=> n.id === bookId)[0];

  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const finishedValue = pageCount === readPage ?? pageCount !== readPage;

  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh > pageCount',
    });
    response.code(400);
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: finishedValue,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
