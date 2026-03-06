# Akutagawa1998.github.io

Personal academic homepage based on `al-folio`, customized for `https://akutagawa1998.github.io/`.

## Site Structure

- **Main site (active):** repository root (`/`)
- **Archived old site:** `webpage_brief/`
- **People page content:** `_pages/profiles.md`
- **Home page content:** `_pages/about.md` + `_layouts/about.liquid`

## Local Preview (Docker)

Detailed guide: `LOCAL_DOCKER_GUIDE.md`

Quick start:

```bash
docker compose down --remove-orphans
docker compose pull
docker compose up
```

Open:

- `http://127.0.0.1:8000/`

## Deployment

GitHub Pages is deployed from `main`.

After edits:

```bash
git add .
git commit -m "Update homepage"
git push origin main
```

Then wait for GitHub Actions Pages deployment to finish.

## Notes

- `baseurl` is intentionally empty in `_config.yml` because the site now runs as the root personal page.
- The previous root static files are preserved in `webpage_brief/` for backup/reference.
