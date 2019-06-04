function buildMetadata(sample) {
    panel = d3.select("#sample-metadata")
    panel.html("")

    url = '/metadata/'+sample;

    d3.json(url).then(function(data) {
      Object.entries(data).forEach(([key, value])=> {
      panel.append('h6').text(`${key}: ${value}`);
      wfreq = data.WFREQ;
      
      var level = wfreq;
      var degrees = 180 - level*20,
      radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);

      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);

      var data3 = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Scrubs',
        text: level,
        hoverinfo: 'text+name'},
      { values: [45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:[
        'rgb(0, 103, 153)',
        'rgb(0, 128, 178)',
        'rgb(0, 154, 204)',
        'rgb(8, 179, 229)',
        'rgb(15, 190, 216)',
        'rgb(20, 201, 203)',
        'rgb(27, 215, 187)',
        'rgb(34, 228, 172)',
        'rgb(42, 245, 152)',
        'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout3 = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    };

    Plotly.newPlot('gauge', data3, layout3);

      });
    });
  }



function buildCharts(sample) {

  url = '/samples/'+sample;
  d3.json(url).then(function(data) {
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker : {
        size: sample_values,
        color: otu_ids,
        colorscale: "Portland",
      }
    }

    var data1 = [trace1];
    var layout1 = {
      title: '<b>Belly Button OTU Bubble Chart</b> <br> Sample' + ` ${sample}`,
      height: 600,
      width: 1600,
      // margin: {
      //   l: 300,
      //   r: 200,
      // },
      xaxis: {
        title: "Operational Taxonomical Units (OTU)",
      },
      yaxis: {
        title: "OTU Frequency",
      },
    }

    Plotly.newPlot('bubble', data1, layout1)
    
    data.sample_values.sort((a,b) => parseFloat(b) - parseFloat(a));
  
    trace2 = {
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels.slice(0,10),
      type: 'pie',
    }

    var data2 = [trace2];
    var layout2 = {
      title: '<b>Belly Button OTU Diversity</b> <br> Sample' + ` ${sample}`
    }
    Plotly.newPlot('pie', data2, layout2)
  });
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
