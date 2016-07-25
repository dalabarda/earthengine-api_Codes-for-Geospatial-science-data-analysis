Google Earth Engine API Codes for Earth science data & analysis
=======================

This is a JavaScript Repository of Goole Earth Engine Scripts for scientific analysis and visualization of geospatial datasets. Each folder in the global page of this repository stands for an independent research developed by me. 

 * [Environmental issues - Light Pollution Assessment in Münsterland, Germany.]
 * [Humanitarian causes - Monitoring Refugee camps in Southern Turkey with Mid-resolution Imagery.]


[Google Earth Engine](https://earthengine.google.com/faq/) is a tool for analyzing geospatial information. It stores current and historical global satellite imagery from different sensors, providing an environment with massive data catalog for large-scale data analysis. It's a [cloud-based platform](https://developers.google.com/earth-engine/) that uses the power of thousands of computers for processing and analysis, therefore its performance is much faster than an ordinary personal computer. There are **Two** ways to use Earth Engine: either through the [Explorer](https://explorer.earthengine.google.com/#workspace) (a high-level point-and-click-only GUI) or through the [Playground](https://code.earthengine.google.com/) (a more low-level IDE for writing custom scripts).

 Google Earth Engine is currently in beta version, so to access its features, you must fill out the form at [https://earthengine.google.com/signup/](https://earthengine.google.com/signup/) and be accepted as an Earth Engine Trust-Tester. **Hence, in order to run the codes here you must have the permission access**. Its use is free for research, education, and nonprofit usage.

Once I'd been accepted as a beta tester, I was able to log in and use the Earth Engine Playground. Never having worked in Javascript before, I followed [one of the tutorials](https://developers.google.com/earth-engine/tutorials) in the Earth Engine JavaScript API documentation to figure out the basics, and then I skimmed through the sections relevant to my interests in the main [guide](https://developers.google.com/earth-engine/) to get started: Images, Image Collections, Features, and Feature Collections. Later I found the rest of the documentation helpful as I started to get into issues of mapping, reducing, and data import/export in answering the agricultural land fallowing question.

Google Earth Engine has two fundamental geographic data structures types that you should be familiar with:
 
 1. [**Images**](https://developers.google.com/earth-engine/image_overview): This is how Google Earth Engine represents raster data types. They are composed of bands (each with its own name, data type, pixel resolution, and projection) and a dictionary of properties storing image metadata. Multiple images (covering multiple areas and/or the same area over time) can be grouped together into an ImageCollection.
 2. [**Features**](https://developers.google.com/earth-engine/features): This is how Earth Engine represents vector data types. They are composed of a geometry and a dictionary of other properties of interest. Features can be grouped into a FeatureCollection.
 
Since Earth Engine is still in beta, there are not billions of [stackoverflow.com](http://stackoverflow.com/) questions and answers to help solve problems once you start trying to use it. Instead, there is a Google group called [Google Earth Engine Developers](https://groups.google.com/forum/#!forum/google-earth-engine-developers) which is full of discussion of how to do different processes. As a beta tester, I had access to this group and found it to be a very valuable resource when I had a question not covered in the basic documentation.


----------
## More from the authors:

 * [GeotechSci blog](http://geotech.besaba.com/blog.html)
 * [Profile on LinkedIn](https://www.linkedin.com/in/danielcsm)
