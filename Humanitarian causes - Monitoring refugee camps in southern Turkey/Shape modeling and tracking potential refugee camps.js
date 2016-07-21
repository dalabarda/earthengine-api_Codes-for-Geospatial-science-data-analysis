//00_Retrospective time series of Refugee camps in Turkey
//Code written by:
//Daniel Carlos dos Santos Machado
//master thesis in science of geospatial technologies UNL & UniMünster

//Working onsite at:
//UniMünster - Geoinformatic institute
//Remote Sensing Applications
//
//Münster, Nordrhein Westfalen, Germany
//Office: 
//Email: dalabarda@gmail.com
//
//
/////////////////////////////////////////////////////////////////
//Basic functions
/////////////////////////////////////////////////////////////////
//
///// LAYER THAT MASKS EVERYTHING EXCEPT THE STUDYAREA \\\\(REVERSE MASK)
    // Fill and outline the polygons in two colors
var studyarea = ee.FeatureCollection('ft:1JKHpV-f6WwnCHe5zK1bOiFlQsf7XHpJSaE8KkIF8')
                .filterMetadata('OBJECTID', 'equals', 1);
var region = ee.Image(0).byte()
    .paint(studyarea, 2)       // Fill with 2
    .paint(studyarea, 1, 2);   // Outline with 1, width 2.
    // Mask off everything that matches the fill color.
    var result = region.mask(region.neq(2));

//
////////// CREATING LAYERS (FEATURES) \\\\\\\\\\
//

var ref_camps = ee.FeatureCollection('ft:1BUImj3LYs3we9OhqkT0spSnSJ3X0Kkv8JYqf30Z6');
              var test_20 = ref_camps.filterMetadata('ObjectID', 'equals' , 20);
     var ref_camps_wet = ref_camps.filterMetadata('climatic region', 'equals' , 'wet');
     var ref_camps_dry = ref_camps.filterMetadata('climatic region', 'equals', 'dry');
        var ref_camps_tent = ref_camps.filterMetadata('Type', 'equals' , 'tent');
        var ref_camps_cont = ref_camps.filterMetadata('Type', 'equals', 'container');
   
    
    // creating polygons from 'ref_camps' feature collection.
      var rc_poly = function(feature) {
        return feature;
    };
      var rc_poly2 = ref_camps.map(rc_poly);
      var poly3 = rc_poly2.union();
      var poly4 = poly3.geometry().geometries();
     
    // creating points from 'ref_camps' feature collection.
     var rc_centroids = function(feature) {
       return feature.centroid();
    };
      var rc_Centroid = ref_camps.map(rc_centroids);
          var Pwet = ref_camps_wet.map(rc_centroids);
          var Pdry = ref_camps_dry.map(rc_centroids);
              var Ptent = ref_camps_tent.map(rc_centroids);
              var Pcont = ref_camps_cont.map(rc_centroids);
      
    // creating bounds from 'ref_camps' feature collection.
      var rc_bounds = function(feature) {
       return feature.bounds().buffer(150);
    };
      var rc_points = ref_camps.map(rc_bounds);
      var bounds = rc_points.union();
      var features = bounds.geometry().geometries();
      var test5 = ee.FeatureCollection(features);
//
////////// CREATING LAYERS (RASTER DATASET) \\\\\\\\\\
//
var gfcImage = ee.Image('UMD/hansen/global_forest_change_2013')
    .select(['treecover2000']).clip(studyarea)
    ;
var srtm = ee.Image('CGIAR/SRTM90_V4').clip(studyarea);

var collNdvi = ee.ImageCollection('LC8_L1T_32DAY_TOA')
        .filterDate('2011-01-01','2014-11-01')
        .filterBounds(bounds)
        .select('B2')
        ;

var imgNdvi32 = ee.Image('LC8_L1T_32DAY_TOA/20140610').select('B2')
    //.filterDate('2011-01-01','2014-11-01')
    //.filterBounds(bounds)
    .clip(studyarea)
    ;
    
      var ndvi_palette = 
    'FFFFFF, CE7E45, DF923D, F1B555, FCD163, 99B718, 74A901, 66A000, 529400,' +
    '3E8601, 207401, 056201, 004C00, 023B01, 012E01, 011D01, 011301';

print(collNdvi);
print(imgNdvi32);

//
////////// CREATING LAYERS (NEW FEATURES) \\\\\\\\\\
//

var area_image = imgNdvi32
             //.where(ee.Image(comp).lt(0.14), 0)
             .where(ee.Image(imgNdvi32).lt(0.24), 0)
             .clip(studyarea)
             ;
var just_area = imgNdvi32.mask(area_image);
     var dd = ee.Image.constant(10).mask(area_image);
        var dd_red = dd.reduce(ee.Reducer.count());

//////////////////////////////////////////////////////////////
////////////////////////// FEATURES:
//////////////////////////////////////////////////////////////

var vec = dd.reduceToVectors(null, //reducer- Reducer.countEvery()
                    bounds, // (bounds, studyarea) geometry to reduce in
                    30, //
                    "polygon", // geometry type
                    true, //eight connector 
                   "label", 
                    "EPSG:4326", //projection
                    null, 
                    false, 
                    100000000000, //max number of pixels to reduce over
                    1, //tileScale
                    false //geometryInNativeProjection 
  );

var ob_vec = ee.Feature(vec);
var ttt = vec.filterMetadata('features', 'equals', 0);
var Pot_cent = function(feature) {
  return feature.centroid();
};
var Pot_ref_camp = vec.map(Pot_cent);

var sum = dd.int().reduceRegion(ee.Reducer.sum(), bounds, 30);
print('Total area:', sum);

////////// PRINTS: \\\\\\\\\\

print(features.size());

print(poly4.map(function(geom) {
  return ee.Geometry(geom).area().int();
}));


print(ref_camps);

print(dd);
print(ob_vec);


////////// LAYERS: \\\\\\\\\\

//Map.addLayer(unioned, {color: '800080'});
Map.addLayer(result, {palette: '000000,222222', max: 1, opacity: 0.5 }, 'Study area', false);
Map.addLayer(srtm, {'min': 0, 'max': 3000}, 'SRTM', false);

addToMap(gfcImage, {'min': [1], 'max': [100],'palette': '000000, 00FF00'}, 'Forest Cover', false);
addToMap(imgNdvi32, {'min': -0.1, 'max': 1.0, 'palette': ndvi_palette}, 'Landsat8');

addToMap(bounds,{'color':'FF0000'},'refugee camps bounds', false);
addToMap(ref_camps,{'color':'FFFF00'},'refugee camps', false);
addToMap(rc_Centroid.draw('DC143C', 4,4 ),{'color':'FF0000'},'refugee camps POINTS', false);
addToMap(Pdry.draw('FF0000', 5,5), {'color':'FF8800'}, 'ref_camps in dry region', false);
addToMap(Pwet.draw('0000FF', 5,5), {'color':'0000FF'}, 'ref_camps in wet region', false);

addToMap(Pcont.draw('4B0082', 5,5), {'color':'800080'}, 'Container camps', false);
addToMap(Ptent.draw('FF6600', 5,5), {'color':'FFA500'}, 'Tent camps', false);

addToMap(vec, {'color': 'FF00FF'}, 'Automatic generated shape', false);

//Map.centerObject(studyarea);


var addArea = function(feature) {
  var area = feature.area();
  var newFeature = feature.set({'myArea': area});
  return newFeature;
};


print(vec.map(function(geom) {
  return ee.Geometry(geom).area().int();
}));

//print(addArea);
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
////////// FURTHER QUESTIONS: \\\\\\\\\\
/*print('There are ' +
      feature.aggregate_count('.all').getInfo() +
      ' bridge photos around SF.');
*/

// IMAGE -> 'WHERE OPERATOR' ; 'Hough Transform' ; 'HSV Pan Sharpening'
// IMAGE COLLECTION - > 'LINEAR FIT'