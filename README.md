# PwaApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.0.

## PWA deployment doesnt work with ng s

1. Run `ng build`.
   - need globally or locally `http-server`
2. run `http-server -p 8080 -c-1 dist/pwa-app/`
3. Notifications to work needs secure context: +VAPID (VAPID stands for Voluntary Application Server Identification)
   - `npm install web-push -g` + `  web-push generate-vapid-keys --json`
   - and replace in project _VAPID_PUBLIC_KEY_
### Still an angular v13 app so handle with care
- can see Service worker magic in action
- Cache (pre/runtime) travolta.gif, bs5, (articles with clicked comments or not).
- notifications API
