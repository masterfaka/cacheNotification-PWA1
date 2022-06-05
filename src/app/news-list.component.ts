import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ApiRequestService } from './api-request.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SwPush } from '@angular/service-worker';

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {
  }

  transform(value: any) {
    console.log(this.sanitized.bypassSecurityTrustHtml(value));
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit, OnDestroy {
  readonly VAPID_PUBLIC_KEY = "BG7Nppu8gI6ec_oWrVxax9TPJ5JKPLhXkJB_Z3tawnMOBL9y63TXIrqNMZZ9GMdD9Whizo1aDxu_yGSDO29o_CI";
  notificationsSubscription: any;
  items: any = [];
  toggledComments: boolean[] = [];/*true for open false for closed*/


  constructor(private apiService: ApiRequestService,
              private swPush: SwPush) {
  }


  ngOnInit(): void {
    this.apiService.getNewsPage().subscribe({
      next: data => this.items = data,
      error: error => console.log(error)
    });

    if(this.swPush.isEnabled) {

      this.swPush.notificationClicks.subscribe(
        ({action, notification}) => {
          // TODO: Do something in response to notification click.
          //test with chrome badge
          //why7 only 2 buttons
          /*let notificationEj = {
            "notification": {
              "title": "MY AWSOME pwa Notification!",
              "icon": "/favicon.ico",
              "image": "/assets/icons/icon-144x144.png",
              "badge": "/assets/icons/badge.png",
              "actions": [{"action": "foo", "title": "New tab"}, {
                "action": "bar",
                "title": "Focus last"
              }, {"action": "baz", "title": "Navigate last"}],
              "data": {
                "onActionClick": {
                  "default": {"operation": "openWindow"},
                  "foo": {"operation": "openWindow", "url": "/absolute/path"},
                  "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
                  "baz": {"operation": "navigateLastFocusedOrOpen"}
                }
              }
            }
          };*/
          console.log("user HAS CLICKED", {action, notification});
        });
    }
  }

  onItemClick(item: any, index: any): void {
    this._setToggled(index);

    if(!!this.toggledComments[index]) {
      this.apiService.getNewsById(item.id).subscribe({
        next: data => {
          this.items[index].comments = data.comments;
          //console.log("item", item);
          //console.log("itemFrom list", this.items[index]);
        },
        error: err => console.log(err)
      });
      this.subscribeToNotifications();
    }
  }

  /** Sets toggled to avoid request on close*/
  private _setToggled(index: any) {
    if(this.toggledComments[index] !== undefined) {
      this.toggledComments[index] = !this.toggledComments[index];
    } else {
      this.toggledComments[index] = true;
    }
  }

  async subscribeToNotifications(): Promise<void> {
    try {
      this.notificationsSubscription = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      });
      console.log("sub", this.notificationsSubscription);
      // TODO: Send to server. Mock with chrome
    } catch(err) {
      console.error('Could not subscribe notifications duw to due to:', err);
    }
  }

  ngOnDestroy(): void {
    console.log("Unsubbed notifications!!!!!");
    this.notificationsSubscription.unsubscribe();
  }
}
