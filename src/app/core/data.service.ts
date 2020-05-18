import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, tap,catchError } from "rxjs/operators";
import { allBooks, allReaders } from "../data";
import { Reader } from "../models/reader";
import { Book } from "../models/book";
import { BookTrackerError } from "../models/bookTrackerError";
import { OldBook } from "../models/oldBook";

@Injectable()
export class DataService {
  apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find((reader) => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    console.log("Getting all books from the server.");
    return this.http.get<Book[]>(this.apiUrl + "/api/books")
    .pipe(
      catchError(err => this.handleHttpError(err))
    )
  }

  private handleHttpError(error: HttpErrorResponse) : Observable<BookTrackerError>{
    let dataError = new BookTrackerError()
    dataError.errorNumber = 100;
    dataError.message=error.statusText,
    dataError.friendlyMessage = "An error occured retrieving data."
    return throwError(dataError)
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(this.apiUrl + `/api/books/${id}`, {
      headers: new HttpHeaders({
        Accept: "application/json",
      }),
    });
  }

  getAllBookById(id: number): Observable<OldBook> {
    return this.http.get<Book>(this.apiUrl + `/api/books/${id}`).pipe(
      map(
        (b) =>
          <OldBook>{
            bookTitle: b.title,
            year: b.publicationYear,
          }
      ),
      tap((classicBook) => console.log(classicBook)) //tap doesnt transform data but give u a way to execute some code before the final observable is returned
    );
  }

  addBook(newBook: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl + `/api/books/`, newBook, {
      headers: new HttpHeaders({
        Accept: "application/json",
      }),
    });
  }

  updateBook(updatedBook: Book): Observable<void> {
    return this.http.put<void>(
      this.apiUrl + `/api/books/${updatedBook.bookID}`,
      updatedBook,
      {
        headers: new HttpHeaders({
          Accept: "application/json",
        }),
      }
    );
  }

  deleteBook(bookID: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/api/books/${bookID}`);
  }
}
