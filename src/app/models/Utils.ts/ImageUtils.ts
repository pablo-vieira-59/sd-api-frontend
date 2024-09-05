export class ImageUtils {
    public static resizeBase64Img(base64: string, newWidth: number, newHeight: number): Promise<string> {
        return new Promise((resolve) => {
            // Step 1: Create an Image object
            const img = new Image();

            img.onload = () => {
                // Step 2: Create a canvas and get its 2D context
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (ctx) {
                    // Step 3: Resize the canvas to the desired dimensions
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Step 4: Draw the image onto the resized canvas
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    // Step 5: Convert the resized canvas back to a base64 string
                    const resizedBase64 = canvas.toDataURL('image/png');
                    resolve(resizedBase64);
                }
            };

            // Step 1 continued: Set the source of the image to the base64 string
            img.src = base64;
        });
    }

    public static getImageDims(imageSrc: HTMLImageElement) {
        var width = imageSrc.width;
        var height = imageSrc.height;
        var aspectRatio = height / width;

        if (height > width) {
            if (height > 1024) {
                height = 1024;
                width = 1024 / (aspectRatio);
            }
        }
        else {
            if (width > 1024) {
                width = 1024;
                height = width * aspectRatio;
            }
        }

        width = Math.floor(width);
        height = Math.floor(height);

        return [width, height];
    }
}