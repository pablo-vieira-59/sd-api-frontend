import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ImageGenerationService } from './services/ImageGenerationService';
import { Txt2ImgGenerationRequest, ImageGenerationResponse, Img2ImgGenerationRequest } from './models/ImageGeneration';
import { CustomOption } from './models/CustomOption';
import { ServiceResult } from './models/ServiceResult';
import { ImageUtils } from './models/Utils.ts/ImageUtils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SDMobile';
  isLoading = false;
  request: Txt2ImgGenerationRequest = new Txt2ImgGenerationRequest();
  requestImg2Img: Img2ImgGenerationRequest = new Img2ImgGenerationRequest();
  result: ImageGenerationResponse = {} as ImageGenerationResponse;

  imageSrc: HTMLImageElement | null = null;
  mask: HTMLCanvasElement | null = null;
  colorMask: HTMLCanvasElement | null = null;

  resultSrc: string | null = null;
  hasError = false;

  formError :string|null= null;
  inputPrompt = "";
  resolutionId: number = 0;
  styleId: number = 1;
  isThumbShowing = false;
  isHdWarningShowing = false;
  isAdvancedShow = false;
  ETA: number = 30;
  tabId: number = 1;

  progress = 0;
  progressStyle = "width: 0%";

  styles = [
    {
      id: 1,
      value: ['Realistic'],
      description: "Realista"
    },
    {
      id: 2,
      value: ['Cartoon'],
      description: "Cartoon"
    },
    {
      id: 3,
      value: ['Digital Art'],
      description: "Arte Digital"
    },
    {
      id: 4,
      value: ['Futuristic'],
      description: "Futurista"
    },
    {
      id: 5,
      value: ['Impressionist'],
      description: "Pintura"
    },
    {
      id: 7,
      value: ['Infographic Drawing'],
      description: "Ilustração"
    },
    {
      id: 8,
      value: ['Graffiti Art'],
      description: "Graffiti"
    },
  ] as CustomOption[];

  resolutions = [
    [768, 768],
    [768, 576],
    [576, 768],
    [1024, 512]
  ];

  constructor(
    private serviceImageGenerator: ImageGenerationService,
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    this.isLoading = false;
  }

  StartTimer() {

    if (this.request.enable_hr) {
      this.ETA = 90;
    }
    else {
      this.ETA = 30;
    }

    this.progress = 0;
    this.SetProgressBar(this.progress);
    const timer = setInterval(() => {
      this.progress++;
      this.SetProgressBar(this.progress);
      if (this.progress >= this.ETA) {
        clearInterval(timer); // Stops the timer
      }
    }, 1000);
  }

  SetProgressBar(value: number) {
    if (value > 0) {
      value = (value / this.ETA) * 100;
      this.progressStyle = "width:" + value + "%;";
      return;
    }

    this.progressStyle = "width:0%;";
  }

  async ShowWarning() {
    this.isHdWarningShowing = this.request.enable_hr;
  }

  async GenerateImage(category: number) {
    var result = {} as ServiceResult;

    this.StartLoading();

    if (category == 1) {
      this.request.prompt = this.inputPrompt;
      this.request.styles = this.styles.find(x => x.id == this.styleId)?.value;
      this.request.height = this.resolutions[this.resolutionId][0];
      this.request.width = this.resolutions[this.resolutionId][1];

      result = await this.serviceImageGenerator.GenerateTxt2Img(this.request);
    }

    if (category == 2) {
      this.formError = null;
      
      if(this.imageSrc == null){
        this.formError = "É necessário realizar um upload de alguma imagem";
        this.StopLoading();
        return;
      };

      var width = this.colorMask!.width;
      var height =this.colorMask!.height;

      var maskSrc = this.mask!.toDataURL('image/png');
      var imgSrc = this.colorMask!.toDataURL('image/png');

      this.requestImg2Img.prompt = this.inputPrompt;
      this.requestImg2Img.styles = this.styles.find(x => x.id == this.styleId)?.value;
      this.requestImg2Img.init_images = [imgSrc.replace("data:image/png;base64,", "")];
      this.requestImg2Img.mask = maskSrc.replace("data:image/png;base64,", "");
      this.requestImg2Img.width = width;
      this.requestImg2Img.height = height;

      result = await this.serviceImageGenerator.GenerateImg2Img(this.requestImg2Img);

      console.log(this.requestImg2Img);
    }

    if (result.isSuccess) {
      this.hasError = false;
      this.result = result.result;
      this.resultSrc = "data:image/png;base64," + this.result.images[0];
    }
    else {
      this.hasError = true;
      this.resultSrc = null;
    }

    this.request.enable_hr = false;
    this.tabId = 3;
    this.StopLoading();
  }

  StartLoading(){
    this.progress = 0;
    this.StartTimer();
    this.isLoading = true;
    this.isThumbShowing = false;
  }

  StopLoading(){
    this.progress = 100;
    this.SetProgressBar(this.progress);
    this.isThumbShowing = false;
    this.isLoading = false;
  }
}

