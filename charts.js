function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
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
  d3.json("samples.json").then((data) => {
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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var samples1 = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var results = resultArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = results.otu_ids;
    var otuLabels = results.otu_labels;
    var sampleValues = results.sample_values;
    console.log(otuID);
    
    // BAR CHAR CODE //
    
    // 7. Create the yticks, x axis and text label for the bar chart (top 10 organized in descending order).
    var yticks = otuID.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var xaxis = sampleValues.slice(0, 10).reverse();
    var textLabel = otuLabels.slice(0, 10).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xaxis,
      y: yticks,
      text: textLabel,
      hovermode: "closest",
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
      var barLayout = {
        xaxis: { title: "OTU ID"},
        yaxis: { title: "Sample Value"},
        height: 500,
        width: 500,
      };
    //10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout,{responsive:true});

    //  BUBBLE CHART CODE //
    // 11. Create the trace for the bubble chart.
    var data = [{
      x: otuID,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
      size: sampleValues,
      color: otuID
      }
    }];
    // 12. Create the layout for the bubble chart.
    var layout = {
      xaxis: { title: "OTU ID"},
      yaxis: { title: "Sample Value"},
      hovermode: "closest",
      height: 600,
      width: 1200
    };
    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data, layout, {responsive:true});

    // GAUGE CHART CODE //
  
    var resultArray1 = samples1.filter(sampleObj => sampleObj.id == sample);
    var results1 = resultArray1[0];
    var gaugeWfreq = results1.wfreq;
    var gaugeWfreqInt = parseInt(gaugeWfreq);
    //14. Create the trace for the gauge chart.
    var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: gaugeWfreqInt,
        title: { text: "Scrubs Per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "lightgrey" },
            { range: [2, 4], color: "lightgray" },
            { range: [4, 6], color: "grey" },
            { range: [6, 8], color: "gray" },
            { range: [8, 10], color: "dimgrey" }
          ],
          bar: { color: "darkblue" }
        }
      }];
    // 15. Create the layout for the gauge chart.
    var layout = { 
      width: 500, 
      height: 500, 
      margin: { t: 0, b: 0 } 
      };
    
      Plotly.newPlot('gauge', gaugeData, layout, {responsive:true});

  });
};