
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { CookieService } from "ngx-cookie";

@Injectable()
export class AuthService {
    constructor(private http: Http, private cookieService: CookieService) {}

    signupUser(email: string, password: string) {
        var newUser = {
            email,
            password
        }
        this.http.post('http://localhost:3000/api/signup', newUser).subscribe(
            (response: Response) => {
                var formatedResponse = response.headers.toJSON();
                var token = formatedResponse['x-auth'][0];
                this.cookieService.put('x-auth', token);


            }
        )
    }
    signinUser(email: string, password: string) {
        var user = {
            email,
            password
        }
        this.http.post('http://localhost:3000/api/signup', user)
    }
}