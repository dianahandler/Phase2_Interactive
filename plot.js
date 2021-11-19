function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("Phase2.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("Phase2.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

  // Deliverable 1 - Bar Chart

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("Phase2.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(filteredSamples);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResults = filteredSamples[0];
    console.log(sampleResults);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleID = sampleResults.otu_id;
    console.log(sampleID);

    

    var sampleValues = sampleResults.sample_values;
    console.log(sampleValues);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = sampleID.map(Id => "" + Id).slice(0,8).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    // Ensure the x values and hover text are in descending order for the trace object.
    var xvalues = sampleValues.slice(0,8).reverse();
    

    var barData = [{
      x: xvalues,
      y: yticks,
      type: "bar",
      orientation: 'h',

    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Most Tossed Timepoints"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

          // Deliverable 2 - Bubble Chart
  
      // 1. Create the trace for the bubble chart.

      var allPlates = data.metadata.map(sample => sample.id);

      var allAcquired = data.metadata.map(sample => sample.Acquired);

      var bubbleData = [{
        x: allPlates,
        y: allAcquired,
        type: "bar",
        marker:{
          color: 'rgb(142,124,195)'
        }
      
      }];
  
      // 2. Create the layout for the bubble chart.

      

      var bubbleLayout = {
        title: "Total Samples Acquired per Plate",
        xaxis: {title: "Plate"},
        
        
        hovermode:'closest'
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

    // Deliverable 3: Gauge Chart 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataResult = data.metadata;
    var metadataResult = metadataResult.filter(Obj => Obj.id == sample);
    console.log(metadataResult);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var sampleMetadata = metadataResult[0];
    console.log(sampleMetadata);

    // 3. Create a variable that holds the washing frequency.
    var numTossed = parseFloat(sampleMetadata.Tossed);
    console.log(numTossed);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: numTossed,
      type: "indicator",
      mode: "gauge+number",
      title: { text: '<b> Number of samples tossed</b>' + '<br> total </br>'},
      gauge: {
        axis: { range: [null, 20]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "darkgreen"},
          {range: [2, 4], color: "yellowgreen"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "orange"},
          {range: [8, 20], color: "red"}
        ]}
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}