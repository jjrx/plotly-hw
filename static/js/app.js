function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel  
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response) {
    // console.log(response);
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // console.log(Object.entries(response))
    Object.entries(response).forEach(([key, value]) => {
      metadata.append("p").text(`${key}: ${value}`);
    });
        // BONUS: Build the Gauge Chart
        // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      hovertext: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Earth"
      }
    };

    var bubble_data = [trace1];

    Plotly.newPlot("bubble", bubble_data);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    console.log(data.otu_labels.slice(0, 10));
    var trace2 = {
      labels: data.otu_ids.slice(0, 10),
      values: data.sample_values.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: 'pie'
    };

    var pie_data = [trace2];

    Plotly.newPlot("pie", pie_data);
  });

// // Enter a speed between 0 and 180
// var level = 175;

// // Trig to calc meter point
// var degrees = 180 - level,
//      radius = .5;
// var radians = degrees * Math.PI / 180;
// var x = radius * Math.cos(radians);
// var y = radius * Math.sin(radians);

// // Path: may have to change to create a better triangle
// var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//      pathX = String(x),
//      space = ' ',
//      pathY = String(y),
//      pathEnd = ' Z';
// var path = mainPath.concat(pathX,space,pathY,pathEnd);

// var gauge_data = [{ type: 'scatter',
//    x: [0], y:[0],
//     marker: {size: 28, color:'850000'},
//     showlegend: false,
//     name: 'speed',
//     text: level,
//     hoverinfo: 'text+name'},
//   { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
//   rotation: 90,
//   text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
//             'Slow', 'Super Slow', ''],
//   textinfo: 'text',
//   textposition:'inside',
//   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//                          'rgba(255, 255, 255, 0)']},
//   labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
//   hoverinfo: 'label',
//   hole: .5,
//   type: 'pie',
//   showlegend: false
// }];

// var layout = {
//   shapes:[{
//       type: 'path',
//       path: path,
//       fillcolor: '850000',
//       line: {
//         color: '850000'
//       }
//     }],
//   title: 'Gauge 
//  Speed 0-100',
//   height: 1000,
//   width: 1000,
//   xaxis: {zeroline:false, showticklabels:false,
//              showgrid: false, range: [-1, 1]},
//   yaxis: {zeroline:false, showticklabels:false,
//              showgrid: false, range: [-1, 1]}
// };

// Plotly.newPlot('gauge', gauge_data, layout);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();