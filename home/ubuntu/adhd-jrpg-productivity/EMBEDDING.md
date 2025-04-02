# Embedding ADHD Quest in Google Sites

This guide explains how to embed the ADHD Quest productivity app in your Google Site.

## Step 1: Prepare the App Files

1. Make sure you have built the app using `npm run build`
2. The built files will be in the `public/build` directory
3. You'll need to host these files somewhere accessible on the web

## Step 2: Host the App Files

### Option 1: GitHub Pages (Recommended)
If you're using GitHub Pages from your repository:

1. Push your repository to GitHub under your account (8bitbyadog)
2. Enable GitHub Pages in your repository settings
3. Choose to serve from the `main` branch and the `/docs` folder
4. Copy the contents of the `public` directory to a `docs` directory in your repository
5. Push the changes to GitHub
6. Your app will be available at `https://8bitbyadog.github.io/adhd-jrpg-productivity/`

### Option 2: Other Web Hosting
You can also host the files on any web server or hosting service:

1. Upload the contents of the `public` directory to your web server
2. Note the URL where the files are accessible

## Step 3: Embed in Google Sites

1. Open your Google Site in edit mode
2. Click the area where you want to embed the app
3. Click the "Insert" button in the right sidebar
4. Select "Embed" from the dropdown menu
5. Choose "Embed code"
6. Paste the following HTML code, replacing `YOUR_URL` with the URL where your app is hosted:

```html
<script src="YOUR_URL/build/bundle.js"></script>
<adhd-productivity-app></adhd-productivity-app>
```

7. Click "Next" and then "Insert"
8. Adjust the size of the embedded app as needed
9. Click "Publish" to update your Google Site

## Step 4: Full Page Embed (Optional)

To create a full-page embed:

1. Create a new page in your Google Site
2. Remove any header or other elements you don't want
3. Insert the embed code as described above
4. Set the embed to take up the full width and height of the page
5. In the embed settings, choose "Full width"

## Troubleshooting

If the app doesn't appear:
- Make sure the bundle.js file is accessible at the URL you provided
- Check your browser console for any errors
- Ensure your Google Site allows embedded content

If the app appears but doesn't work correctly:
- Make sure you're using the latest version of the app
- Try clearing your browser cache
- Check that localStorage is enabled in your browser

## Notes on Privacy

Since the app uses localStorage for data storage:
- Each user's data is stored only in their own browser
- Data is not shared between users
- Data will persist between sessions on the same device and browser
- Users should use the Export feature to backup their data

## Support

If you encounter any issues with embedding the app, please open an issue on the GitHub repository.
