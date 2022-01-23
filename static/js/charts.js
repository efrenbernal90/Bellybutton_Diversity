function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
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
  d3.json("static/js/samples.json").then((data) => {
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
      PANEL.append("h6").append('b').text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1.1. Create the buildCharts function.
function buildCharts(sample) {
  // 1.2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // 3.1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata.filter(foo => foo.id ==sample);
    // 1.3. Create a variable that holds the samples array. 
    let samplesArray = data.samples;
    // 3.2. Create a variable that holds the first sample in the metadata array.
    var metadataSample = metadataArray[0]; 
    console.log(metadataSample);
    // 1.4. Create a variable that filters the samples for the object with the desired sample number.
    let samples = samplesArray.filter(element => element.id == sample);
    //  1.5. Create a variable that holds the first sample in the array.
    let currentSample = samples[0];
    console.log(currentSample);
    // 1.6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDs = currentSample.otu_ids;
    let otuLabels = currentSample.otu_labels.slice(0,10).reverse();
    let sampleValues = currentSample.sample_values.slice(0,10).reverse(); 
    // console.log(otuIDs);
    // 3.3. Create a variable that holds the washing frequency.
    let wFreq = metadataSample.wfreq;
    console.log(wFreq);

    let bubbleLabels = currentSample.otu_labels;
    let bubbleValues = currentSample.sample_values;

    // 1.7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIDs.map(foo => "OTU: " + foo).slice(0,10).reverse();
     
    // console.log(yticks);
    
    // 1.8. Create the trace for the bar chart. 
    var barData = [{
          x: sampleValues,
          y: yticks ,
          type: "bar",
          orientation: "h",
          text: otuLabels
    }];
    // 1.9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {title: "Sample Value"},
        automargin: true,
        paper_bgcolor: "darkgrey",
    };
    // 1.10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);
    console.log(sampleValues);

    // 2.1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: bubbleValues,
      text: bubbleLabels,
      mode: 'markers',
      colorscale: 'Electric',
      marker: {
        color: bubbleValues,
        size: bubbleValues,
        colorscale: 'Earth'
      }
    }];

    // 2.2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}, 
      paper_bgcolor: "darkgrey",
      automargin: true
    };

    // 2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 3.4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
      title: { text: "<b> Bellybutton Wash Frequency </b> <br> Wash per Week", font: { size: 24}
      },
      gauge: {
        axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" },
        ]
      }
    }];

    // 3.5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true,
      paper_bgcolor: "darkgrey",
      font: { color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData,gaugeLayout);
  });
}
