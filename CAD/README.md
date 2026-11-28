# CAD gallery

This folder is the public gallery at https://warrendaisey.com/CAD/.

A lowercase `/cad/` path also exists (`../cad/index.html`) and redirects here, because GitHub Pages URLs are case-sensitive.

The public page asks for a password before loading the model list or previews. The check is client-side (see `gate.js`) and is remembered in localStorage. Direct file URLs are still reachable; this is a convenience gate, not real access control.

## How to add a model

1. Put the file in `models/<group>/`. STL is the format the viewer already loads.
2. Add an object to `models.json` (the page reads this list on load):

```json
{
  "name": "Widget",
  "file": "models/widgets/Widget.stl",
  "preview": "models/widgets/Widget.preview.stl",
  "description": "Optional short blurb.",
  "group": "Widgets"
}
```

`name` and `file` are required. `description` and `group` are optional. Models that share a `group` appear together under that heading, in the order they are listed.


Optional `attribution` on any model in a group is shown under the section heading (creator, source link, and license). Use this for third-party designs:

```json
"attribution": {
  "creator": "Name",
  "creatorUrl": "https://www.thingiverse.com/name",
  "source": "Thingiverse",
  "sourceUrl": "https://www.thingiverse.com/thing:123",
  "license": "CC BY"
}
```


Optional `subgroup` on a model starts a labeled sub-heading within the section, so variants can be grouped without adding extra navigator entries.

Optional `groupExtras` on any model in a group is shown under the credit as section-level downloads (for example an instructions PDF).

Optional `groupNote` on any model in a group is shown under the credit as a short section note.

Optional `extras` is a list of additional downloads on the same card (for example a STEP file):

```json
"extras": [
  { "file": "models/widgets/Widget.step", "label": "Download STEP" }
]
```

`preview` is optional. When it is set, the on-page 3D viewer loads that lighter mesh instead of `file`. The Download button always serves the exact `file`. Use this for large STLs: keep the full-resolution original as `file`, and add a decimated preview of a few MB or less.

3. Commit and push to `main`. GitHub Pages will publish the new card at `/CAD/`.

After unlock, a section navigator is built from the same `group` values in `models.json`. New groups show up in that list automatically.

Keep each file under GitHub's 100 MB limit. Previews lazy-load when a card scrolls into view, so the page's initial load stays light even when a project includes large download files.
