import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { Book } from "../models/book";
import { DataService } from "../core/data.service";
import { OldBook } from "../models/oldBook";

@Component({
  selector: "app-edit-book",
  templateUrl: "./edit-book.component.html",
  styles: [],
})
export class EditBookComponent implements OnInit {
  selectedBook: Book;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    let bookID: number = parseInt(this.route.snapshot.params["id"]);
    this.dataService.getBookById(bookID).subscribe(
      (data: Book) => (this.selectedBook = data),
      (err: any) => console.log(err)
    );

    this.dataService
      .getAllBookById(bookID)
      .subscribe((data: OldBook) =>
        console.log(`Old book title: ${data.bookTitle}`)
      );
  }

  setMostPopular(): void {
    this.dataService.setMostPopularBook(this.selectedBook);
  }

  saveChanges(): void {
    this.dataService.updateBook(this.selectedBook).subscribe(
      (data: void) =>
        console.log(`${this.selectedBook.title} updated successfully. `),
      (err: any) => console.log(err)
    );
  }
}
