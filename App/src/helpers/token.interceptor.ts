import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class TokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const regex = /^fixer$/gi;
    let headers = null;
    const match = regex.test(request.url.toString());
    console.log('regex match', match);
    if (match) {
      headers = request.headers.append('Content-Type', 'application/json');
      request = request.clone({headers: headers});
      if (token) {
        headers = request.headers.append('X-Token', token);
        request = request.clone({headers: headers});
      }
    }
    return next.handle(request);
  }

}
