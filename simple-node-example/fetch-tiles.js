require('@loaders.gl/polyfills')
const { load } = require('@loaders.gl/core');
const { Tileset3D } = require('@loaders.gl/tiles');
const { Tiles3DLoader } = require('@loaders.gl/3d-tiles');
const { WebMercatorViewport } = require('@deck.gl/core');
const { writeFile } = require('fs/promises');
var fs = require('fs');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2), {
  float: ['latitude', 'longitude'],
  int: ['screenSpaceError', 'width', 'height', 'zoom'],
  string: ['output_path'],
  default: {
    latitude: 53.343318,
    longitude: -2.650661,
    screenSpaceError: 2,
    width: 230,
    height: 175,
    zoom: 19,
  }
});
console.log("args:", args);

async function run() {
  console.log(`🌀  fetch-tiles: (lat:${args.latitude},lon=${args.longitude}) -zoom=${args.zoom}-${args.height}x${args.width}-error:${args.screenSpaceError}-> ${args.output_path}`);

  // https://stackoverflow.com/a/26815894/17619982
  if (!fs.existsSync(args.output_path)) {
    fs.mkdirSync(args.output_path, { recursive: true });
    console.log(`created ${args.output_path}`);
  }

  // Get your key:
  // https://developers.google.com/maps/documentation/tile/3d-tiles
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY
  const tilesetUrl = 'https://tile.googleapis.com/v1/3dtiles/root.json?key=' + GOOGLE_API_KEY;

  const viewport = new WebMercatorViewport({
    width: args.width,
    height: args.height,
    latitude: args.latitude,
    longitude: args.longitude,
    zoom: args.zoom
  });

  console.log("Fetching tileset...")
  const tilesetJson = await load(tilesetUrl, Tiles3DLoader);
  const tileset3d = new Tileset3D(tilesetJson, {
    throttleRequests: false,
    loadGLTF: false,
    loadOptions: {
      '3d-tiles': { loadGLTF: false },
    },
    maximumScreenSpaceError: args.screenSpaceError
  })

  console.log("Traversing....")
  let currentTilesLoadedNum = 0
  // Traverse until we've loaded all the tiles for the given viewport & screen space error threshold
  while (!tileset3d.isLoaded()) {
    if (tileset3d.tiles.length > currentTilesLoadedNum) {
      currentTilesLoadedNum = tileset3d.tiles.length
      console.log(`${currentTilesLoadedNum} tiles fetched...`)
    }
    await tileset3d.selectTiles(viewport)
  }
  // Sort the tiles so we get the ones with the smallest error first
  const tiles = tileset3d.tiles.sort((tileA, tileB) => {
    return tileA.header.geometricError - tileB.header.geometricError
  })

  // Fetch all the glTF's and write them to disk 
  const glbUrls = []
  const sessionKey = getSessionKey(tileset3d)
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i]
    const url = `${tile.contentUrl}?key=${GOOGLE_API_KEY}&session=${sessionKey}`
    console.log(`Downloading glTF ${i}`)
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Failed to fetch ${url}`)
      continue;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(`${args.output_path}/${i}.glb`, buffer);
  }

  // TODO: these glTF's are in ECEF coordinates
  // would be nice to port the code from Viewer.js here 
  // that can renormalize them and re-orient them
}

run()

function getSessionKey(tileset) {
  return new URL(`http://website.com?${tileset.queryParams}`).searchParams.get("session")
}