import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  providers: [BookService]
})

export class BooksComponent implements OnInit {
  books: Book[];
  selectedBook: Book;
  title: string;
  author: string;

  constructor(private bookService: BookService) {
    this.bookService.getBooks()
      .subscribe(books => {
        this.books = books;
      });
  }

  ngOnInit() {
  }

  addBook(event){
    event.preventDefault();
    const newBook:Book = {
      title: this.title,
      author: this.author,
      _id: ''
    };
    this.bookService.addBook(newBook)
      .subscribe(book => {
        this.books.push(book);
        this.title = '';
      })
  }

  deleteBook(id) {
    //const response = confirm('are you sure to delete it?');
    //if (response){
    const books = this.books;
    this.bookService.deleteBook(id)
      .subscribe(data => {
          for(let i = 0; i < books.length; i++) {
            if(books[i]._id == id) {
              books.splice(i, 1);
            }
          }
        })
    //}
  }

  onSelect(book: Book) {
    this.selectedBook = book;
  }



}
