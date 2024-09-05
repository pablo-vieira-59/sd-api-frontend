import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ImageUtils } from 'src/app/models/Utils.ts/ImageUtils';

@Component({
  selector: 'app-ocorp-canvas',
  templateUrl: './ocorp-canvas.component.html',
  styleUrls: ['./ocorp-canvas.component.css']
})
export class OcorpCanvasComponent implements OnInit {

  private drawing = false;
  pointerSize: number = 16;
  globalCanvasWidth = 0;
  globalCanvasHeight = 0;
  maxWidth = 640;  // Set your desired width
  maxHeight = 640; // Set your desired height
  scale = 2;
  pointerMin = 2;
  pointerMax = 64;
  paintColor = "#000000";

  @ViewChild('canvasElement', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pointerCanvasElement', { static: false }) pointerCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageElement', { static: false }) imageCanvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D | null;
  private pointerCtx!: CanvasRenderingContext2D | null;
  private imageCtx!: CanvasRenderingContext2D | null;

  @Input()
  imageSrc: HTMLImageElement | null = null;
  @Output()
  imageSrcChange: EventEmitter<HTMLImageElement | null> = new EventEmitter<HTMLImageElement | null>();

  @Input()
  mask: HTMLCanvasElement | null = null;
  @Output()
  maskChange: EventEmitter<HTMLCanvasElement | null> = new EventEmitter<HTMLCanvasElement | null>();

  @Input()
  colorMask: HTMLCanvasElement | null = null;
  @Output()
  colorMaskChange: EventEmitter<HTMLCanvasElement | null> = new EventEmitter<HTMLCanvasElement | null>();

  @Input()
  paintMode: number = 1;
  @Output()
  paintModeChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    if (window.outerWidth < 640) {
      this.maxWidth = window.outerWidth - 40;
      this.maxHeight = window.outerWidth - 40;
    }

    this.globalCanvasWidth = this.maxWidth;
    this.globalCanvasHeight = this.maxHeight;
  }

  async ngAfterViewInit() {
    // Get the 2D drawing context from the canvas
    this.ctx = this.canvasRef.nativeElement.getContext('2d');
    this.pointerCtx = this.pointerCanvasRef.nativeElement.getContext('2d');
    this.imageCtx = this.imageCanvasRef.nativeElement.getContext('2d');

    if (this.imageSrc == null) {
      this.resizeCanvas(this.globalCanvasWidth, this.globalCanvasHeight);
    }
    else {
      await this.resizeAndDrawImage(this.imageSrc);
    }

    if (this.ctx && this.pointerCtx) {
      this.ctx.lineWidth = this.pointerSize;  // Set the drawing line width
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';  // Set the drawing line cap style

      if (this.colorMask != null) {
        var img = this.colorMask.toDataURL('image/png');
        var imgElement = new Image();

        imgElement.onload = () => {
          this.imageCtx!.drawImage(imgElement, 0, 0, this.colorMask!.width, this.colorMask!.height);
        };

        imgElement.src = img;
      }

      if (this.mask != null) {
        var imgMask = this.mask.toDataURL('image/png');
        var imgElementMask = new Image();

        imgElementMask.onload = () => {
          this.ctx!.drawImage(imgElementMask, 0, 0, this.mask!.width, this.mask!.height);
        };

        imgElementMask.src = imgMask;
      }

      this.mask = this.canvasRef.nativeElement;
      this.maskChange.emit(this.mask);

      this.colorMask = this.imageCanvasRef.nativeElement;
      this.colorMaskChange.emit(this.colorMask);
    }

    this.updateCursorSize();

    // Initialize event listeners for mouse and touch actions
    this.initializeCanvasEvents();
  }

  private initializeCanvasEvents(): void {
    const canvas = this.canvasRef.nativeElement;
    const pointerCanvas = this.pointerCanvasRef.nativeElement;

    // Mouse events
    pointerCanvas.addEventListener('mousedown', (event: MouseEvent) => this.startDrawing(event));
    pointerCanvas.addEventListener('mousemove', (event: MouseEvent) => {
      this.draw(event);
      this.showPointer(event); // Show the point of contact
    });
    pointerCanvas.addEventListener('mouseup', () => this.stopDrawing());
    pointerCanvas.addEventListener('mouseleave', () => this.stopDrawing());

    // Touch events
    pointerCanvas.addEventListener('touchstart', (event: TouchEvent) => this.startTouchDrawing(event));
    pointerCanvas.addEventListener('touchmove', (event: TouchEvent) => {
      this.drawTouch(event);
      this.showPointerTouch(event); // Show the point of contact
    });
    pointerCanvas.addEventListener('touchend', () => this.stopDrawing());
    pointerCanvas.addEventListener('touchcancel', () => this.stopDrawing());
  }

  private getMousePosition(event: MouseEvent): { x: number; y: number } {
    const rect = this.pointerCanvasRef.nativeElement.getBoundingClientRect(); // Get the bounding rectangle of the pointer canvas
    const scaleX = this.pointerCanvasRef.nativeElement.width / rect.width;  // Calculate the horizontal scale factor
    const scaleY = this.pointerCanvasRef.nativeElement.height / rect.height;  // Calculate the vertical scale factor

    return {
      x: (event.clientX - rect.left) * scaleX,  // Adjust for both canvas position and scale
      y: (event.clientY - rect.top) * scaleY
    };
  }

  private getTouchPosition(event: TouchEvent): { x: number; y: number } {
    const rect = this.pointerCanvasRef.nativeElement.getBoundingClientRect(); // Get the bounding rectangle of the pointer canvas
    const scaleX = this.pointerCanvasRef.nativeElement.width / rect.width;  // Calculate the horizontal scale factor
    const scaleY = this.pointerCanvasRef.nativeElement.height / rect.height;  // Calculate the vertical scale factor
    const touch = event.touches[0]; // Get the first touch point

    return {
      x: (touch.clientX - rect.left) * scaleX,  // Adjust for both canvas position and scale
      y: (touch.clientY - rect.top) * scaleY
    };
  }

  private startDrawing(event: MouseEvent): void {
    this.drawing = true;
    const pos = this.getMousePosition(event);
    if (this.ctx) {
      this.ctx.beginPath(); // Begin a new path (resetting the current drawing)
      this.ctx.moveTo(pos.x, pos.y); // Move the path to where the mouse was clicked
    }
    if (this.imageCtx && this.paintMode == 2) {
      this.imageCtx.beginPath(); // Begin a new path (resetting the current drawing)
      this.imageCtx.moveTo(pos.x, pos.y);
    }
  }

  private startTouchDrawing(event: TouchEvent): void {
    event.preventDefault(); // Prevent default touch behavior to avoid scrolling or other actions
    this.drawing = true;
    const pos = this.getTouchPosition(event);
    if (this.ctx) {
      this.ctx.beginPath(); // Begin a new path (resetting the current drawing)
      this.ctx.moveTo(pos.x, pos.y); // Move the path to where the touch occurred
    }
    if (this.imageCtx && this.paintMode == 2) {
      this.imageCtx.beginPath(); // Begin a new path (resetting the current drawing)
      this.imageCtx.moveTo(pos.x, pos.y);
    }
  }

  private draw(event: MouseEvent): void {
    if (!this.drawing || !this.ctx) return; // Only draw if the mouse is down and within the canvas
    const pos = this.getMousePosition(event);
    // Line to the current mouse position
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke(); // Draw the current line

    if (this.imageCtx && this.paintMode == 2) {
      this.imageCtx.lineTo(pos.x, pos.y);
      this.imageCtx.stroke();
    }
  }

  private drawTouch(event: TouchEvent): void {
    event.preventDefault(); // Prevent default touch behavior
    if (!this.drawing || !this.ctx) return; // Only draw if the touch is active and within the canvas
    const pos = this.getTouchPosition(event);
    // Line to the current touch position
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke(); // Draw the current line

    if (this.imageCtx && this.paintMode == 2) {
      this.imageCtx.lineTo(pos.x, pos.y);
      this.imageCtx.stroke();
    }
  }

  private stopDrawing(): void {
    this.drawing = false; // Stop drawing when the mouse is released or leaves the canvas
    if (this.ctx) {
      this.ctx.closePath();
    }
    if (this.imageCtx && this.paintMode == 2) {
      this.imageCtx.closePath();
    }
  }

  public updateCursorSize() {
    if (!this.ctx) return;

    this.ctx.lineWidth = this.pointerSize;

    if (!this.imageCtx) return;

    this.imageCtx.lineWidth = this.pointerSize;
  }

  private showPointer(event: MouseEvent): void {
    if (!this.pointerCtx || !this.ctx) {
      return;
    }

    const pos = this.getMousePosition(event);

    // Clear the pointer canvas to remove the previous pointer
    this.pointerCtx.clearRect(0, 0, this.pointerCanvasRef.nativeElement.width, this.pointerCanvasRef.nativeElement.height);

    // Draw the circle
    this.pointerCtx.beginPath();
    this.pointerCtx.arc(pos.x, pos.y, this.ctx.lineWidth / 2, 0, Math.PI * 2); // Draw a circle at the mouse position
    this.pointerCtx.fillStyle = '#00000060'; // Set the color of the circle
    this.pointerCtx.fill(); // Fill the circle with the color
    this.pointerCtx.closePath(); // Close the path to finalize the drawing
  }

  private showPointerTouch(event: TouchEvent): void {
    if (!this.pointerCtx || !this.ctx) return; // Do not show the pointer while drawing

    const pos = this.getTouchPosition(event);

    // Clear the pointer canvas to remove the previous pointer
    this.pointerCtx.clearRect(0, 0, this.pointerCanvasRef.nativeElement.width, this.pointerCanvasRef.nativeElement.height);

    // Draw the circle
    this.pointerCtx.beginPath();
    this.pointerCtx.arc(pos.x, pos.y, this.ctx.lineWidth / 2, 0, Math.PI * 2); // Draw a circle at the touch position
    this.pointerCtx.fillStyle = '#00000060'; // Set the color of the circle
    this.pointerCtx.fill(); // Fill the circle with the color
    this.pointerCtx.closePath(); // Close the path to finalize the drawing
  }

  public async fillBackgroundWithWhite() {
    if (this.ctx) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (this.imageCtx && this.paintMode == 2) {
      if (this.imageSrc) {
        await this.resizeAndDrawImage(this.imageSrc);
      }
      else {
        this.imageCtx.clearRect(0, 0, this.maxWidth, this.maxHeight);
      }
    }
  }

  async onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = async () => await this.resizeAndDrawImage(img);
        img.src = e.target!.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  resizeCanvas(width: number, height: number) {
    this.scale = this.maxWidth / width;

    this.globalCanvasWidth = width * this.scale;
    this.globalCanvasHeight = height * this.scale;

    var canvas = this.imageCanvasRef.nativeElement;
    canvas.width = width;
    canvas.height = height;
    this.resetCanvasBrush(canvas);

    canvas = this.canvasRef.nativeElement;
    canvas.width = width + 4;
    canvas.height = height + 4;
    this.resetCanvasBrush(canvas);

    canvas = this.pointerCanvasRef.nativeElement;
    canvas.width = width;
    canvas.height = height;
    this.resetCanvasBrush(canvas);
  }

  resetCanvasBrush(canvas: HTMLCanvasElement) {
    canvas.getContext("2d")!.lineCap = 'round';
    canvas.getContext("2d")!.lineJoin = 'round';
  }

  async resizeAndDrawImage(img: HTMLImageElement) {
    let width = img.width;
    let height = img.height;

    if (width > 1024 || height > 1024) {
      var dims = ImageUtils.getImageDims(img);
      width = dims[0];
      height = dims[1];
    }

    this.imageSrc = img;
    this.imageSrcChange.emit(this.imageSrc);

    this.pointerMin = Math.floor(width * 0.01);
    this.pointerMax = Math.floor(width * 0.20);
    this.pointerSize = Math.floor(width * 0.10);

    // Clear the canvas
    if (this.imageCtx) {
      var canvas = this.imageCanvasRef.nativeElement;
      this.imageCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Resize the canvas
      this.resizeCanvas(width, height);

      // Draw the image on the canvas
      this.imageCtx.drawImage(img, 0, 0, width, height);
    }

    this.updateCursorSize();
  }

  changeBrushColor() {
    this.imageCtx!.strokeStyle = this.paintColor;
    this.imageCtx!.fillStyle = this.paintColor;
  }
}
