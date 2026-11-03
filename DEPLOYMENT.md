# Deploy the portfolio for everyone

Code folder: `C:\Users\Dipesh Mishra\Desktop\Projects\Projects\dipesh-portfolio-studio`

The `dist/` directory contains the complete static website, including authored source JavaScript, CSS, local font, 3D library, GSAP, and artwork. The files in `dist/` are edited directly; they are not disposable generated output.

## Push to your new GitHub repository

The selected repository is https://github.com/dipesh-m12/dipeshportfolio. From this project folder:

```powershell
git remote add github https://github.com/dipesh-m12/dipeshportfolio.git
git push github HEAD:main
```

The project already has Git history. If you create the GitHub repository with a README or other commits, reconcile the histories before pushing; do not force-push over them.

If Git reports a Windows ownership mismatch for this newly created project, use a command-scoped setting:

```powershell
git -c safe.directory="C:/Users/Dipesh Mishra/Desktop/Projects/Projects/dipesh-portfolio-studio" remote add github https://github.com/dipesh-m12/dipeshportfolio.git
git -c safe.directory="C:/Users/Dipesh Mishra/Desktop/Projects/Projects/dipesh-portfolio-studio" push github HEAD:main
```

If a `github` remote already exists, inspect it with `git remote -v` and use that remote when it matches your repository.

## GitHub Pages

1. Open the new repository's Settings → Pages.
2. Choose **GitHub Actions** as the source.
3. Open Actions → **Publish portfolio to GitHub Pages** → Run workflow, selecting `main`.

The included `.github/workflows/pages.yml` publishes `dist/` on pushes to `main`. Assets use relative paths, so the project URL `https://dipesh-m12.github.io/dipeshportfolio/` works when Pages is enabled. The workflow does not require npm installation or a build.

Official setup: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Vercel

Import the GitHub repository into Vercel. The included `vercel.json` sets a static deployment with output directory `dist` and no build command. Leave the project root at the repository root. The contact form uses the existing external email service.

When choosing a final public domain, update the `og:url` in `dist/index.html` to that domain so shared previews identify the intended address. The current value is the Sites URL.

## Local preview

```powershell
npm run dev
```

Then open http://127.0.0.1:4175. Use an HTTP server rather than double-clicking the HTML file, because the site uses JavaScript modules.
