//// CREATING THE ENVIRONMENT TEST WITH 9 PIXELS FROM SRTM IN A RANDOM PLACE: 
var rect = ee.Geometry.Rectangle([36.6534, 37.6325,36.6558, 37.6301]);
var test_data = ee.Image('CGIAR/SRTM90_V4').clip(rect);
var img0 = ee.Image(test_data);
Map.setCenter(36.6545, 37.6312, 17);

// Add the image to the Playground with a visualization parameter.
Map.addLayer(test_data, {'min': 442, 'max': 495});
//addToMap(srtm);
addToMap(rect);
////////////////////////////////////////////////////////////////////////////////

////// Function to compute a histogram for pixels within the defined boundary. 

// MIN statis:
var Print_MIN = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.min(),
            geometry: rect});
                        };

// MAX statis:
var Print_MAX = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.max(),
            geometry: rect});
                        };

// MEAN statis:
var Print_MEAN = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.mean(),
            geometry: rect});
                        };

// MEDIAN statis:
var Print_MEDIAN = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.median(),
            geometry: rect});
                        };

// MODE statis:
var Print_MODE = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.mode(),
            geometry: rect});
                        };

// SUM statis:
var Print_SUM = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.sum(),
            geometry: rect});
                        };
// COUNT statis:
var Print_COUNT = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.count(),
            geometry: rect});
                        };

// STDDEV statis:
var Print_STDDEV = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.stdDev(),
            geometry: rect});
                        };

// VARIANCE statis:
var Print_VARIANCE = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.variance(),
            geometry: rect});
                        };

// PRODUCT statis:
var Print_PRODUCT = function(img) {
return img.reduceRegion({
            reducer: ee.Reducer.product(),
            geometry: rect});
                        };

/////////////////////////////
//// PRINTING THE RESULTS:

var MIN = Print_MIN(img0);
      print('MIN', MIN);
var MAX = Print_MAX(img0);
      print('MAX', MAX);
var MEDIAN = Print_MEDIAN(img0);
      print('MEDIAN', MEDIAN);
var MEAN = Print_MEAN(img0);
      print('MEAN', MEAN);
var MODE = Print_MODE(img0);
      print('MODE', MODE);
var STDDEV = Print_STDDEV(img0);
      print('STDDEV', STDDEV);
var VARIANCE = Print_VARIANCE(img0);
      print('VARIANCE', VARIANCE);
var STDDEV = Print_STDDEV(img0);
      print('STDDEV', STDDEV);
var SUM = Print_SUM(img0);
      print('SUM', SUM);
var PRODUCT = Print_PRODUCT(img0);
      print('PRODUCT', PRODUCT);
var COUNT = Print_COUNT(img0);
      print('COUNT', COUNT);