```javascript

/////Defining the study area (2 areas of choice)
//Münsterland administrative region in vector format
var ROI_1 = ee.FeatureCollection('ft:1xTHdjomV2F5CbAGdAcHl-S5aLdInTEHzXSlAoKVm')
      .filterMetadata('NAME_2', 'equals', "Munster");
      
//Münsterland region in simplified vector format
var ROI_2 = ee.FeatureCollection('ft:1rS4KW1A2RInPfPJtztIeWzbuGljXiHd97vCYqnKh');

var muensterland = ROI_2; // or ROI_1

Map.centerObject(muensterland, 9);
Map.addLayer(muensterland, {}, 'Münsterland area');

/////Data collection and processisng
//Collection of NightTime VIIRS data
var viirs_coll = ee.ImageCollection("users/dalabarda/VIIRS");

// Reducing image stack
var sum = viirs_coll.sum();
var max = viirs_coll.max();
var min = viirs_coll.min();
var mean = viirs_coll.mean();
// mean ignoring min and max of the year.
var mean2 = (sum.select('b1').subtract(min.select('b1'))
              .subtract(max.select('b1'))).divide(10);

// selection one of the images reduced
var img = mean; // sum, max, min, mean or mean2

var mask = img.clip(muensterland)
              .select(['b1']).lte(64);

// Apply the mask to the image.
var masked = mean.updateMask(mask);

var median = viirs_coll.median();


// collection of 3 images
var coll =  ee.ImageCollection.fromImages([median, mean, mean2])

/*------------------------------------------------*/
/////////////////////////////////////////////////
///MEAN IMAGE  TOP 10 BRIGHTEST LOCATIONS////////
/*------------------------------------------------*/
// 't' means the threshold value
var t = 0; //--> 22.2 for 15 points, 25.6 for 10 points
var increment = 0.01;

var t0 = t;
var i = 0;
var numPlaces = [];
var VIIRS_thres = [];
var codeTry_count = 0;

while (i < 10) {

    var area_imageMean = masked
             .where(masked
             .gt(t), 0)  
             ;
 
  var ddmean = ee.Image.constant(10).mask(area_imageMean);
  var vecMean = ddmean.reduceToVectors(null, //reducer- Reducer.countEvery()
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
      return ee.Feature(f.buffer(10))
    });
    
  var mean_centroids = vecMean.map(function(feature) {
    return ee.Feature(feature.centroid());
  });

  var i = mean_centroids.size().toInt().getInfo();

  numPlaces.push(i);
  VIIRS_thres.push(t);
  VIIRS_thres;
  codeTry_count++;
  t+= increment; // this happens as long as try was executed
 
}

// Custom function to make the precision of floating points.
function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
}

t = toFixed((t + increment),2); // Just to ajust the last iteraion that dont make the push 

print(t0 + " is the initial threshold value.");
print('The code attempted ' + codeTry_count + ' times before get the final result.');
print(i + ' places found!');
print(t + ' is the image threshold value.');


//Creating list with 2 values
var ar = [numPlaces, VIIRS_thres];

//Convert rows to columns function
var r = ar[0].map(function(col, i) {
  return ar.map(function(row) {
    return row[i];
  });
});

//function to display the table into the Console
function getDataTable(Dict) {
  var rows = Dict.map(function(v, i) {
    var min = numPlaces[i] ;
    return {c: [{v: min}, {v: v}]}
  });
  var cols = [
      {id: 'polynumbers', label: 'Number of Polygons', type: 'number'},
      {id: 'thres', label: 'VIIRS Threshold', type: 'number'}
  ];
  return {cols: cols, rows: rows};
}

print("Number of Bright Places per Threshold (decreasing 0.1):",
        Chart(getDataTable(VIIRS_thres), 'Table'));


///////////////////////////////////////
var palette = ['000000,FF0000,FFFF00,FFFF00,FFFFFF,FFFFFF'];
Map.addLayer(masked, {min:0, max:2, palette:[palette]}, 'Img Mean', false);
Map.addLayer(vecMean, {'color':'FF0000'}, 'Mean Vector', false);
addToMap(mean_centroids, {'color':'FF00FF'}, 'Mean Centroid of the BRIGHTEST places');
```