import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  private readonly ONLINE = 'online';
  private readonly OFFLINE = 'offline';
  title = 'pwa-app';
  netStatus= {
    status: this.ONLINE,
    offline: false,
    color: '#17eba0'
  };
  netStatusFunc: EventListener;
  appStatusColor= 'tomato';
  offline: boolean= false;

  constructor() {
    this.netStatusFunc= this.onNetworkStatusChange.bind(this);
  }


  ngOnInit(): void {
    window.addEventListener(this.ONLINE,  this.netStatusFunc);
    window.addEventListener(this.OFFLINE, this.netStatusFunc);
  }

  private onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
    if(this.offline){
      this.netStatus.color=  'tomato';
      this.netStatus.status= this.OFFLINE;
    }else{
      this.netStatus.status= this.ONLINE;
      this.netStatus.color=  "#17eba0";
    }
  }


  ngOnDestroy(): void {
    window.removeEventListener(this.ONLINE, this.netStatusFunc);
    window.removeEventListener(this.OFFLINE, this.netStatusFunc);
  }
}
