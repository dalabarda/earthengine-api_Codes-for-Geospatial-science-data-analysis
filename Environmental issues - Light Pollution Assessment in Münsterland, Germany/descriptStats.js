/////Descriptive Statistics - Münsterland
/////Münsterland region in vector format
var muensterland = ee.FeatureCollection('ft:1rS4KW1A2RInPfPJtztIeWzbuGljXiHd97vCYqnKh');
Map.centerObject(muensterland, 8);

var buffer = function(feature) {
  return (feature.geometry()).buffer(100000).bounds();
};


/////Data Collection of Night-time Data (DMSP and VIIRS)
//// Compute the trend of nighttime lights from DMSP.
// Add a band containing image date as years since 1991.
function createTimeBand(img) {
  var date = img.get('system:time_start');
  var year = ee.Date(date).get('year').subtract(1991);
  return ee.Image(year).byte().addBands(img).set('system:time_start', date);
}

// Fit a linear trend to the nighttime lights collection.
var collection = ee.ImageCollection('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS')
    .select('stable_lights')
    .map(createTimeBand);
var fit = collection.reduce(ee.Reducer.linearFit());

//Collection of NightTime VIIRS data 
var viirs_coll = ee.ImageCollection("users/dalabarda/VIIRS");


print(collection);
print(fit);

//// Display trend in red/blue, brightness in green.
Map.addLayer(fit.clip(buffer(muensterland)),
         {min: 0, max: [0.18, 20, -0.18], bands: ['scale', 'offset', 'scale']},
         'stable lights trend');

// Print a chart and plot a polygon on the map for each region.
var printRegion = function(region, regionName) {
  var onlyLights = collection.select(1);
  var chart = Chart.image.seriesByRegion(onlyLights, region,ee.Reducer.mean(), 
              'stable_lights', 50, 'system:time_start', 'label');
            //Chart.image.series(onlyLights, region, ee.Reducer.mean(), 100);
  var chart = chart.setOptions({
        title: 'Night-time data over ' + regionName + ' (DMSP-OLS sensor)',
        vAxis: {title: 'Mean'},
          lineWidth: 1,
          pointSize: 4,
      });
  var chart = chart.setChartType('ScatterChart');
      
  print(chart);
  Map.addLayer(region, {color: 'FFFFFF'});
};

printRegion(muensterland, 'Münsterland');

// VIIRS Time series of 2015
var VIIRSTimeSeries = Chart.image.seriesByRegion(viirs_coll, muensterland,
    ee.Reducer.mean(), '', 100, 'system:time_start', 'label');
VIIRSTimeSeries = VIIRSTimeSeries.setChartType('ScatterChart');
VIIRSTimeSeries = VIIRSTimeSeries.setOptions({
  title: 'Night Time data over Münsterland (NPP-VIIRS sensor)',
  vAxis: {
    title: 'Mean'
  },
  lineWidth: 1,
  pointSize: 4,
 
});
print(VIIRSTimeSeries);

///////CLIPPING/////////////////////////////////////////////

/////Clipping Collection of NightLight Images with muensterland
var coll_clip = viirs_coll
    .map(function(coll){
        return coll.clip(muensterland)}
        );
//reducing the collections
var count = coll_clip.count();
var sum = coll_clip.sum();
var max = coll_clip.max();
var min = coll_clip.min();
var mean = coll_clip.mean();
var median = coll_clip.median();
// mean ignoring min and max of the year.
var mean2 = (sum.select('b1').subtract(min.select('b1')).subtract(max.select('b1'))).divide(10);

// collection of 3 images
var coll =  median.addBands(mean).addBands(mean2);
print(coll);
var printVIIRS = function(region, regionName) {
  
  var onlyLights = coll.select(1);
  var chart = Chart.image.seriesByRegion(onlyLights, region,ee.Reducer.mean(), 
              'stable_lights', 50, 'system:time_start', 'label');
            //Chart.image.series(onlyLights, region, ee.Reducer.mean(), 100);
  var chart = chart.setOptions({
        title: 'Night-time data over ' + regionName + ' (DMSP-OLS sensor)',
        vAxis: {title: 'Mean'},
          lineWidth: 1,
          pointSize: 4,
      });
  var chart = chart.setChartType('ScatterChart');
      
  print(chart);
  Map.addLayer(region, {color: 'FFFFFF'});
};
//printVIIRS();

var darkness = mean.mask(mean.lte(1));
//Map.addLayer(darkness, {min:0, max:1, palette:['000000,FF0000,FFFF00,FFFF00,FFFFFF,FFFFFF']}, 'Darkness');

var lightness = ee.Image(mean.mask(mean.gte(1)));
lightness = lightness.mask(lightness.lte(10));
//Map.addLayer(lightness, {min:1, max:10, palette:['000000,FF0000,FFFF00,FFFF00,FFFFFF,FFFFFF']}, 'Lightness');

var lightness2 = ee.Image(mean.mask(mean.gte(10)));
lightness2 = lightness2.mask(lightness2.lte(25));
//Map.addLayer(lightness2, {min:10, max:25, palette:['000000,FF0000,FFFF00,FFFF00,FFFFFF,FFFFFF']}, 'Lightness2');

var outliers = mean.mask(mean.gte(25));
//Map.addLayer(outliers, {min:25, max:130, palette:['000000,FF0000,FFFF00,FFFF00,FFFFFF,FFFFFF']}, 'Outliers');

var histogramChartMean =
    Chart.image.histogram(mean, muensterland, 50, null, 0.00000000001);
                          
print(histogramChartMean);

    Chart.image.histogram(darkness, muensterland, 100, null, 0.01);
var histogramChartDark =

var histogramChartLight =
    Chart.image.histogram(lightness, muensterland, 100, null, 0.01);

var histogramChartLight2 =
    Chart.image.histogram(lightness2, muensterland, 100, null, 0.01);

var histogramChartOut =
    Chart.image.histogram(outliers, muensterland, 50, null, 0.00000000001);

print(histogramChartDark, histogramChartLight, histogramChartLight2,histogramChartOut);
