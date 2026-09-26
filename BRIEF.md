mkdir -p /Users/admin/hyper-landings-astro && cd /Users/admin/hyper-landings-astro
printf ".DS_Store\n*.zip\n" > .gitignore
pbpaste > BRIEF.md   # сначала скопируй бриф ниже
git init -b main && git add . && git commit -m "Monorepo brief"
git remote add origin git@github.com:noirvision/hyper-landings-astro.git
git push -u origin main