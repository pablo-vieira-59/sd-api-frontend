export class Txt2ImgGenerationRequest {
  prompt: string = "";
  negative_prompt: string = "nsfw,nude,naked,nipples,genital,penis,boobs,pubic hair,pussy,(deformed iris, deformed pupils), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck";
  styles: string[] = [];
  sampler_name: string = "DPM++ SDE";
  scheduler: string = "Karras";
  batch_size: number = 1;
  n_iter: number = 1;
  steps: number = 28;
  cfg_scale: number = 7;
  distilled_cfg_scale: number = 3.5;
  width: number = 768;
  height: number = 768;
  restore_faces: boolean = true;
  tiling: boolean = false;
  seed:number = -1;
  enable_hr:boolean = false;
  hr_scale:number=1.5;
  save_images:boolean=true;
  denoising_strength: number = 0.55;
  hr_second_pass_steps :number = 10;
}

export class Img2ImgGenerationRequest{
  prompt: string = "";
  negative_prompt: string = "(deformed iris, deformed pupils), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck";
  styles: string[] = [];
  sampler_name: string = "DPM++ SDE";
  scheduler: string = "Karras";
  batch_size: number = 1;
  n_iter: number = 1;
  steps: number = 30;
  cfg_scale: number = 7;
  distilled_cfg_scale: number = 3.5;
  width: number = 768;
  height: number = 768;
  restore_faces: boolean = true;
  tiling: boolean = false;
  seed:number = -1;
  save_images:boolean=true;
  denoising_strength: number = 0.50;
  init_images: string[] = [];
  resize_mode:number = 0;
  image_cfg_scale:number= 0;
  firstpass_image:string = "";
  mask:string = "";
  mask_blur_x:number = 6;
  mask_blur_y:number = 6;
  mask_blur:number = 12;
  mask_round:boolean = true;
  inpainting_fill:number = 1;
  inpaint_full_res:boolean = true;
}

export class ImageGenerationResponse {
  images : string[] = [];
}

