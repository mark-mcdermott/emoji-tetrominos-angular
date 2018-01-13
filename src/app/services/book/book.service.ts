import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Book } from '../../models/book' ;

@Injectable()
export class BookService {
  domain: string = 'http://localhost:3000';
  //domain: string = 'http://34.215.246.25:3000';

  constructor(private http: HttpClient) { }

  getBook(id) {
    return this.http.get<Book>(`${this.domain}/api/book/${id}`)
      .map(res => res);
  }

  getBooks() {
    return this.http.get<Book[]>(`${this.domain}/api/books`)
      .map(res => res);
  }

  addBook(newBook: Book) {
    return this.http.post<Book>(`${this.domain}/api/books`, newBook)
      .map(res => res);
  }

  deleteBook(id) {
    return this.http.delete<Book>(`${this.domain}/api/books/${id}`)
      .map(res => res);
  }

  updateBook(updatedBook: Book) {
    return this.http.put<Book>(`${this.domain}/api/books/${updatedBook._id}`, updatedBook)
      .map(res => res)
  }

}
