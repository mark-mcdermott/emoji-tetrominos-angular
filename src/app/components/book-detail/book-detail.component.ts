import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
  providers: [BookService]
})
export class BookDetailComponent implements OnInit {

  book: Book;
  books: Book[];
  author: string;
  title: string;
  id: string;

  constructor(private router: Router, private route: ActivatedRoute, private bookService: BookService) {
    this.route.params.subscribe( params => this.id = params.id );

    this.bookService.getBooks()
      .subscribe(books => {
        this.books = books;
        for (let book of books) {
          if (book._id === this.id) {
            this.book = book;
          }
        }
      });

  }

  ngOnInit() {
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
              this.router.navigate(['/books']);
            }
          }
        })

    //}
  }

  updateBook(updatedBook){
    // event.preventDefault();
    // const updatedBook:Book = {
    //   title: this.title,
    //   author: this.author,
    //   _id: this.id
    // }
    // console.log(updatedBook);
    this.bookService.updateBook(updatedBook)
      .subscribe(book => {
        this.books.push(book);
        this.title = '';
        this.author = '';
        this.id = '';
      })
  }

}
