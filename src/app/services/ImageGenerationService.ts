import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, timeout, pipe  } from 'rxjs';
import { ServiceResult } from '../models/ServiceResult';
import { Txt2ImgGenerationRequest, ImageGenerationResponse, Img2ImgGenerationRequest } from '../models/ImageGeneration';



@Injectable({
	providedIn: 'root'
})
export class ImageGenerationService {
	base_url = environment.backendUrl;

	constructor(
        private http: HttpClient,
	) { }

	private GetHeader(){
		return new HttpHeaders({
			'Authorization': 'Basic ' + environment.auth
		  });
	}

    async GenerateTxt2Img(requestData :Txt2ImgGenerationRequest):Promise<ServiceResult>{
        var result = {} as ServiceResult;

		var apiUrl = environment.backendUrl + "sdapi/v1/txt2img";
		console.log(apiUrl);

		const headers = this.GetHeader();

		var request = this.http.post<ImageGenerationResponse>(apiUrl,requestData,{headers});
		
		await lastValueFrom(await request.pipe(timeout(environment.timeoutValue)))
	    .then((payload) => {
			result.result = payload;
            result.isSuccess = true;
	    })
	    .catch((error) => {
	      result.isSuccess = false;
          result.message = error;
	    });

	    return result;
	}

	async GenerateImg2Img(requestData :Img2ImgGenerationRequest):Promise<ServiceResult>{
        var result = {} as ServiceResult;

		var apiUrl = environment.backendUrl + "sdapi/v1/img2img";
		console.log(apiUrl);

		const headers = this.GetHeader();

		var request = this.http.post<ImageGenerationResponse>(apiUrl,requestData,{headers});
		
		await lastValueFrom(await request.pipe(timeout(environment.timeoutValue)))
	    .then((payload) => {
			result.result = payload;
            result.isSuccess = true;
	    })
	    .catch((error) => {
	      result.isSuccess = false;
          result.message = error;
	    });

	    return result;
	}
}