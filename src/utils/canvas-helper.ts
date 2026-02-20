
/**
 * Composites a logo onto a base image.
 * @param baseImageSrc The source URL/Base64 of the main character image.
 * @param logoSrc The source URL/Base64 of the logo image.
 * @param position 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
 * @returns Promise resolving to the Base64 string of the composited image.
 */
export async function compositeLogo(
    baseImageSrc: string,
    logoSrc: string,
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right'
): Promise<string> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
        }

        const baseImg = new Image();
        const logoImg = new Image();

        baseImg.onload = () => {
            // Set canvas to match base image dimensions
            canvas.width = baseImg.width;
            canvas.height = baseImg.height;

            // Draw base image
            ctx.drawImage(baseImg, 0, 0);

            logoImg.onload = () => {
                // Determine logo size (e.g., 20% of base image width)
                const targetLogoWidth = canvas.width * 0.25;
                const scale = targetLogoWidth / logoImg.width;
                const targetLogoHeight = logoImg.height * scale;

                let x = 0;
                let y = 0;
                const padding = canvas.width * 0.05; // 5% padding

                switch (position) {
                    case 'bottom-right':
                        x = canvas.width - targetLogoWidth - padding;
                        y = canvas.height - targetLogoHeight - padding;
                        break;
                    case 'bottom-left':
                        x = padding;
                        y = canvas.height - targetLogoHeight - padding;
                        break;
                    case 'top-right':
                        x = canvas.width - targetLogoWidth - padding;
                        y = padding;
                        break;
                    case 'top-left':
                        x = padding;
                        y = padding;
                        break;
                }

                ctx.drawImage(logoImg, x, y, targetLogoWidth, targetLogoHeight);
                resolve(canvas.toDataURL('image/png'));
            };

            logoImg.onerror = (err) => reject(new Error("Failed to load logo image"));
            logoImg.src = logoSrc;
        };

        baseImg.onerror = (err) => reject(new Error("Failed to load base image"));
        baseImg.src = baseImageSrc;
    });
}
