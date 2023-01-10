// {
//   id: string | number,
//   title: string,
//   author: string,
//   year: number,
//   isComplete: boolean,
// }

const book = [];
const RENDER_SHELF = "render-shelf";

function generateID() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle");
  const bookAuthor = document.getElementById("inputBookAuthor");
  const bookYear = document.getElementById("inputBookYear");
  const bookStatus = document.getElementById("inputBookIsComplete");

  const bookID = generateID();
  const bookObject = generateBookObject(
    bookID,
    bookTitle.value,
    bookAuthor.value,
    bookYear.value,
    bookStatus.checked
  );
  book.push(bookObject);
  document.dispatchEvent(new Event(RENDER_SHELF));
  saveData();
}

function makeBookShelf(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;
  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = "Penulis: " + author;
  const bookYear = document.createElement("p");
  bookYear.innerText = "Tahun: " + year;

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");
  const redButton = document.createElement("button");
  redButton.innerText = "Hapus Buku";
  redButton.classList.add("red");
  const greenButton = document.createElement("button");
  greenButton.classList.add("green");

  if (isComplete) {
    greenButton.innerText = "Belum Selesai dibaca";
    greenButton.addEventListener("click", function () {
      undoBook(id);
    });
  } else {
    greenButton.innerText = "Selesai dibaca";
    greenButton.addEventListener("click", function () {
      finishBook(id);
    });
  }

  redButton.addEventListener("click", function () {
    deleteBook(id);
  });

  buttonContainer.append(greenButton, redButton);

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("book_item");
  bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);
  bookContainer.setAttribute("id", `book-${id}`);
  return bookContainer;
}

document.addEventListener(RENDER_SHELF, function () {
  const completedBook = document.getElementById("completeBookshelfList");
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  completedBook.innerHTML = "";
  incompleteBook.innerHTML = "";

  for (const bookItem of book) {
    const bookElement = makeBookShelf(bookItem);
    if (bookItem.isComplete) {
      completedBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const submitInput = document.getElementById("inputBook");
  submitInput.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function findID(bookID) {
  for (const bookItem of book) {
    if (bookItem.id === bookID) {
      return bookItem;
    }
  }
  return null;
}

function deleteBook(bookID) {
  const bookTarget = findID(bookID);
  let text = "Apakah anda yakin ingin menghapus buku " + bookTarget.title + "?";
  if (bookTarget == null) return;
  if (confirm(text) == true) {
    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_SHELF));
    saveData();
    return;
  } else {
    return;
  }
}

function finishBook(bookID) {
  const bookTarget = findID(bookID);
  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_SHELF));
  saveData();
}

function undoBook(bookID) {
  const bookTarget = findID(bookID);
  if (bookTarget == null) return;
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_SHELF));
  saveData();
}

const STORAGE_KEY = "BOOKSHELF_APP";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    localStorage.getItem(STORAGE_KEY);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const bookItem of data) {
      book.push(bookItem);
    }
  }
  document.dispatchEvent(new Event(RENDER_SHELF));
}
