# CAD gallery

This folder is the public gallery at https://warrendaisey.com/CAD/.

A lowercase `/cad/` path also exists (`../cad/index.html`) and redirects here, because GitHub Pages URLs are case-sensitive.

## How to add a model

1. Put the file in `models/<group>/`. STL is the format the viewer already loads.
2. Add an object to `models.json` (the page reads this list on load):

```json
{
  "name": "Widget",
  "file": "models/widgets/Widget.stl",
  "description": "Optional short blurb.",
  "group": "Widgets"
}
```

`name` and `file` are required. `description` and `group` are optional. Models that share a `group` appear together under that heading, in the order they are listed.

3. Commit and push to `main`. GitHub Pages will publish the new card at `/CAD/`.

Keep each file under GitHub's 100 MB limit. Large models are fine, but the first preview of a big STL can take a few seconds to load. Previews lazy-load when a card scrolls into view.
