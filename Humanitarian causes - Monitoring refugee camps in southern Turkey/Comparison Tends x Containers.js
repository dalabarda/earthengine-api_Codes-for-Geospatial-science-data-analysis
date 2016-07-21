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

var ref_camps = ee.FeatureCollection('ft:1BUImj3LYs3we9OhqkT0spSnSJ3X0Kkv8JYqf30Z6');
            var campN1 =  ref_camps.filterMetadata('ObjectID', 'equals', 9);
                  var PcampN1 = campN1.geometry(); // --> container
            var campN2 =  ref_camps.filterMetadata('ObjectID', 'equals', 13);
                  var PcampN2 = campN2.geometry(); // --> tent
            
Map.centerObject(campN1);

///// LANDSAT PERIOD OF CLEAR SKY AND BOTH CAMPS FULL
var collection = ee.ImageCollection('LC8_L1T_TOA')
    .filterDate(new Date('4/5/2014'), new Date('7/1/2014'));

var image1 = collection
        .median()
        ;


///// PARAMETER:
var LinearFit = image1;
//var LinearFit2 = image1.reduce(ee.Reducer.mean());

///// HISTOGRAM 

var Histogram1 = Chart.image.histogram(LinearFit.select([0,1,2,3,4,5,6]), PcampN1, 15, 40)
                  .setOptions({
      title: 'Histogram of Band Values from CONTAINER CAMP',});
var Histogram2 = Chart.image.histogram(LinearFit.select([0,1,2,3,4,5,6]), PcampN2, 15, 40)
                  .setOptions({
      title: 'Histogram of Band Values from TENT CAMP',});

var Histogram1_2 = Chart.image.histogram(LinearFit.select([1]), PcampN1, 15, 40);
var Histogram2_2 = Chart.image.histogram(LinearFit.select([1]), PcampN2, 15, 40);

print(Histogram1);
print(Histogram2);
print(Histogram1_2);
print(Histogram2_2);
///// Layers:

addToMap(campN2);
addToMap(campN1);
