import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserHotModel} from "../models/user-hot.model";
import {CollectionHotModel} from "../models/collection-hot.model";

@Injectable({
  providedIn: "root"
})

export class CollectionService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) {
  }

  getHotCollections(lastDays: number): Observable<CollectionHotModel> {
    const url = `${this.baseUrl}/collection/get/hot`;
    return this._http.get<any>(url, {
      params: {
        lastDays: lastDays
      }
    })
  }

}
