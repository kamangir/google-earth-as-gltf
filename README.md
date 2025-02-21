# Google Earth as glTF models

An [abcli](https://github.com/kamangir/awesome-bash-cli) fork of [google-earth-as-gltf](https://github.com/OmarShehata/google-earth-as-gltf), through [roofai](https://github.com/kamangir/roofAI).

```bash
pip install roofai
```

## browse

```bash
@google_earth \
	browse \
	[dev,sandbox]
 . browse google earth tools.
```

## fetch

```bash
@google_earth \
	fetch \
	[dryrun,install,upload] \
	[-|<object-name>] \
	[--latitude=<49.279802>] \
	[--longitude=<-123.115660>] \
	[--screenSpaceError=<2>] \
	[--width=<230>] \
	[--height=<175>] \
	[--zoom=<19>]
 . fetch from google earth.
```

<details>
<summary>Legacy README</summary>

A little web app to demonstrate (1) how to fetch 3D Tiles from the [Google Photorealistic API](https://developers.google.com/maps/documentation/tile/3d-tiles) and (2) how to correctly normalize & rotate the glTF tiles, or combine a set of them into one glTF that can be rendered in any standard engine.

_NOTE: This is intended to be an educational tool to provide an easy way to experiment with the API and understand how to tweak different parameters like zoom & screen space error. See [Google's Map Tiles API policies](https://developers.google.com/maps/documentation/tile/policies) . Note especially that offline use is prohibited._

### Try it here: https://omarshehata.github.io/google-earth-as-gltf/

https://github.com/OmarShehata/google-earth-as-gltf/assets/1711126/03fe3b48-fa39-48ba-b83a-772454949980


### How it works

- `src/index.js` uses [loaders.gl](https://loaders.gl/) to take a given lat/lng/zoom level, traverse the tileset and return a list of URLs to glTF tiles
- `src/Viewer.js` takes these URLs, fetches them, normalizes the tiles from ECEF to centered around (0, 0, 0)

See [simple-node-example/](simple-node-example) for a minimal example of just fetching tiles for a given region, which all the extra logic the app does around filtering for tiles that match the requested screen space error.

### What is "screen space error"?

Think of it as roughly meaning "level of detail". The lowest possible SSE is 1 which is the highest quality. When you're zoomed out a lot you want to load higher SSE to get bigger tiles that cover a wider area (but that are lower quality).

Screen space error is a concept defined in the 3D Tiles specification, see: https://github.com/CesiumGS/3d-tiles/tree/main/specification#geometric-error

### Running it locally

- `npm install`
- `npm run dev`

</details>

---


[![pylint](https://github.com/kamangir/roofai/actions/workflows/pylint.yml/badge.svg)](https://github.com/kamangir/roofai/actions/workflows/pylint.yml) [![pytest](https://github.com/kamangir/roofai/actions/workflows/pytest.yml/badge.svg)](https://github.com/kamangir/roofai/actions/workflows/pytest.yml) [![bashtest](https://github.com/kamangir/roofai/actions/workflows/bashtest.yml/badge.svg)](https://github.com/kamangir/roofai/actions/workflows/bashtest.yml) [![PyPI version](https://img.shields.io/pypi/v/roofai.svg)](https://pypi.org/project/roofai/) [![PyPI - Downloads](https://img.shields.io/pypi/dd/roofai)](https://pypistats.org/packages/roofai)

built by 🌀 [`blue_options-4.223.1`](https://github.com/kamangir/awesome-bash-cli), based on 🏛️ [`roofai-6.292.1`](https://github.com/kamangir/roofai).
