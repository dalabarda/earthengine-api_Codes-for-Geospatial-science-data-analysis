var muensterland = ee.FeatureCollection('ft:1rS4KW1A2RInPfPJtztIeWzbuGljXiHd97vCYqnKh');
Map.addLayer(muensterland, {}, 'Münsterland area');

/////Collection of NightTime VIIRS data /////////////////////////
var viirs_coll = ee.ImageCollection("users/dalabarda/VIIRS");

//Clipping Collection of NightLight Images with muensterland
var coll_clip = viirs_coll
    .map(function(coll){
        return coll.clip(muensterland)}
        );

// Reducing image stack
var mean = coll_clip.mean();

// Define an SLD style of discrete intervals to apply to the image.
var sld_intervals =
  '<RasterSymbolizer>' +
    '<ColorMap  type="intervals" extended="false" >' +
      '<ColorMapEntry color="#000000" quantity="0" label="0"/>' +
      '<ColorMapEntry color="#2644a5" quantity="0.3" label="0-0.3" />' +
      '<ColorMapEntry color="#9ccee3" quantity="0.6" label="0.3-0.6" />' +
      '<ColorMapEntry color="#99cc00" quantity="1" label="0.6-1" />' +
      '<ColorMapEntry color="#fef716" quantity="5" label="1-5" />' +
      '<ColorMapEntry color="#f27901" quantity="15" label="5-15" />' +
      '<ColorMapEntry color="#ca1c1c" quantity="30" label="15-30" />' +
      '<ColorMapEntry color="#ffffff" quantity="64" label="30-64" />' +
    '</ColorMap>' +
  '</RasterSymbolizer>';


// Add the image to the map using both the color ramp and interval schemes.
Map.addLayer(mean.sldStyle(sld_intervals), {}, 'SLD intervals');


var color = ['2644a5', '9ccee3', '99cc00', 'fef716', 'f27901', 'ca1c1c', 'ffffff'];
var arr = [[0, 0.3],[0.3, 0.6],[0.6, 1],[1, 5],[5, 15],[15, 30],[30, 64]];
var count = arr.length;
//var rivers_image = ee.Image(0).mask(0).toByte();
var fc = {};

for(var i=0; i<count; i++) {
  var area = ee.Image.constant(10).mask(mean
             .where(mean.gte(arr[i][1]), 0).where(mean.lt(arr[i][0]), 0));
             
   var vec = area.reduceToVectors(null, //reducer- Reducer.countEvery()
          muensterland, // geometry to reduce in
          90, //
          "polygon", // geometry type
          true, //eight connector 
         "label", 
          "EPSG:4326", //projection
          null, 
          false, 
          100000000000, //max number of pixels to reduce over
          1, //tileScale
          false //geometryInNativeProjection 
  ).map(function(f) {
      return ee.Feature(f.buffer(1))
    });

  var mean_centroids = vec.map(function(feature) {
    return ee.Feature(feature);
  });
  //print(mean_centroids);
  Map.addLayer(vec, {'color': color[i]}, ' Artificial light intensity ranging between  ' + arr[i][0] + ' ‒ ' + arr[i][1] + '  in Nano-Watts.', false);
}
