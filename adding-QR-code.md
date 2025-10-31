# Adding QR Code to About Section

This guide explains how to add or update the QR code displayed in the about section of the website.

## Current Implementation

The about page (`about.html`) includes a QR code section that displays a payment QR code for UPI donations. The QR code is implemented using an `<img>` tag with the ID `qr-code-img`.

## Location in Code

The QR code can be found in `about.html` around line 48-52, within the Support section:

```html
<div class="qr-code-box" style="margin-top: 20px; padding: 20px; text-align: center; background-color: var(--section-bg-blend); border-radius: 8px;">
    <div style="width: 200px; height: 200px; margin: 0 auto; background-color: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; padding: 10px; overflow: hidden;">
        <img src="data:image/png;base64,..." alt="UPI QR Code" style="width: 100%; height: 100%; object-fit: contain;" id="qr-code-img">
    </div>
</div>
```

## How to Add/Update QR Code

### Option 1: Using Base64 Encoding (Recommended)

This method embeds the QR code directly in the HTML, which is ideal for small images and avoids external file dependencies.

1. **Generate your QR code** using any QR code generator:
   - For UPI payments, use a UPI QR code generator with your UPI ID
   - Recommended services: Google Pay, PhonePe, Paytm QR code generators
   - Or use online generators like [QR Code Generator](https://www.qrcode-monkey.com/) or [QR Code Monkey](https://www.the-qrcode-generator.com/)

2. **Convert the QR code image to Base64**:
   - Use an online tool like [Base64 Image Encoder](https://www.base64-image.de/)
   - Or use command line: `base64 -i qrcode.png`
   - Or use online converter: [Image to Base64](https://base64.guru/converter/encode/image)

3. **Replace the `src` attribute** in `about.html`:
   ```html
   <img src="data:image/png;base64,YOUR_BASE64_STRING_HERE" alt="UPI QR Code" ...>
   ```

### Option 2: Using External Image File

This method uses a separate image file hosted with your website.

1. **Generate and save your QR code** as a PNG or JPG file

2. **Upload the file** to your website's directory (same folder as about.html)

3. **Update the `src` attribute** to point to your file:
   ```html
   <img src="qr-code-upi.png" alt="UPI QR Code" ...>
   ```

### Option 3: Using External URL

This method links to an image hosted elsewhere.

1. **Host your QR code image** on a reliable image hosting service (e.g., GitHub, Imgur, Cloudinary)

2. **Get the direct image URL**

3. **Update the `src` attribute**:
   ```html
   <img src="https://your-image-host.com/qr-code.png" alt="UPI QR Code" ...>
   ```

## Styling Notes

- The QR code container has a white background (`background-color: #ffffff`) to ensure the QR code is always visible
- The image dimensions are set to 200x200 pixels
- The container uses `object-fit: contain` to maintain aspect ratio
- The outer box uses `var(--section-bg-blend)` for theme-aware styling

## Testing

After updating the QR code:

1. Open `about.html` in a web browser
2. Test in both light and dark modes
3. Ensure the QR code is scannable using a mobile device
4. Verify the QR code opens the correct payment app/URL

## Example: Complete QR Code Section

```html
<h2>Support This Project</h2>
<p>Maintaining and expanding this archive takes time and resources. If you find the information valuable, please consider supporting its development through the following channels:</p>
<ul>
    <li><strong>Patreon:</strong> <a href="https://patreon.com/yourpage" target="_blank">Support on Patreon</a></li>
    <li><strong>UPI:</strong> yourname@upi</li>
</ul>
<div class="qr-code-box" style="margin-top: 20px; padding: 20px; text-align: center; background-color: var(--section-bg-blend); border-radius: 8px;">
    <div style="width: 200px; height: 200px; margin: 0 auto; background-color: #ffffff; display: flex; align-items: center; justify-content: center; border-radius: 8px; padding: 10px; overflow: hidden;">
        <img src="data:image/png;base64,YOUR_QR_CODE_BASE64_HERE" alt="UPI QR Code" style="width: 100%; height: 100%; object-fit: contain;" id="qr-code-img">
    </div>
    <p style="margin-top: 10px; font-size: 0.9em; color: var(--meta-color);">Scan with any UPI app to donate</p>
</div>
```

## Tips

- Keep the QR code image size reasonable (under 50KB for Base64)
- Test the QR code with multiple QR scanners/UPI apps
- Consider adding a caption below the QR code explaining what it's for
- Ensure the QR code has good contrast (typically black on white background)
- Save a backup of your QR code image separately

## Security Considerations

- Only use QR codes from trusted sources
- Verify the QR code points to your intended destination before publishing
- Regularly test the QR code to ensure it hasn't expired or changed
- If using UPI, ensure the UPI ID in the QR code is correct

## Need Help?

If you encounter issues:
1. Verify your Base64 string is complete and properly formatted
2. Check browser console for any errors
3. Ensure your image format is supported (PNG, JPG, WebP)
4. Test with a smaller image if the file is large
