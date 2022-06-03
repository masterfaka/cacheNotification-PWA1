import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: any) {
    console.log(this.sanitized.bypassSecurityTrustHtml(value))
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
   items: any= [];
   toggledComments: boolean[] =[];/*true for open false for closed*/
  constructor(private apiService: ApiRequestService) { }

  ngOnInit(): void {
    this.apiService.getNewsPage().subscribe({
      next: data => this.items=data,
      error: error => console.log(error)
    });
  }

  onItemClick(item: any, index: any) : void{
    if(this.toggledComments[index] !== undefined){
      this.toggledComments[index]= !this.toggledComments[index];
    }

    if(!this.toggledComments[index]){
      this.apiService.getNewsById(item.id).subscribe({
        next: data=> {
          this.items[index].comments= data.comments;
          //console.log("item", item);
          console.log("itemFrom list", this.items[index]);
        },
        error: err=> console.log(err)
      });
    }
  }
}
