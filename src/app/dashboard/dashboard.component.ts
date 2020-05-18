import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Title } from "@angular/platform-browser";

import { Book } from "../models/book";
import { Reader } from "../models/reader";
import { DataService } from "../core/data.service";
import { BookTrackerError } from "../models/bookTrackerError";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styles: [],
})
export class DashboardComponent implements OnInit {
  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(
    private dataService: DataService,
    private title: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    let resovedData:Book[] | BookTrackerError = this.route.snapshot.data['resolvedBooks']

    if(resovedData instanceof BookTrackerError) {
      console.log(`Dashboard component error: ${resovedData.friendlyMessage}`)
    }
     else {
      this.allBooks= resovedData
    }

    this.allReaders = this.dataService.getAllReaders();
    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  deleteBook(bookID: number): void {
    this.dataService.deleteBook(bookID).subscribe(
      (data: void) => {
        let index: number = this.allBooks.findIndex(
          (book) => book.bookID === bookID
        );
        this.allBooks.splice(index, 1);
      },
      (err: any) => console.log(err)
    );
  }

  deleteReader(readerID: number): void {
    console.warn(`Delete reader not yet implemented (readerID: ${readerID}).`);
  }
}
