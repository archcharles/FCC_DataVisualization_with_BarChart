   // variables for svg (canvas)
   let width = 800;
   let height = 600;
   let padding = 50;
   let svg = d3.select('body').append('svg');    // select body and append svg element
   // variables for chart
   let heightScale;
   let xScale;
   let yScale;
   let xAxis;
   let yAxis;
   let xAxisScale;
   let yAxisScale;
   // variables for JSON data
   let dataJSON;
   let dataset = [];
   let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
   let req = new XMLHttpRequest();

   // canvas for chart
   let drawCanvas = () => {
      svg.attr('width', width)
         .attr('height', height);
   }

   let generateChartTitle = (titleLocationX, titleLocationY) => {
      d3.select('svg')
         .append('text')
         .text('USA GDP')
         .attr('id', 'title')
         .attr('x', titleLocationX)
         .attr('y', titleLocationY);
   }

   let generateScales = () => {
      xScale = d3.scaleLinear()
                  .domain([0, dataset.length - 1])
                  .range([padding, width - padding]);
      yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, (item) => item[1])])
                  .range([0, height - (2 * padding)]);
      heightScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, (item) => item[1])])
                  .range([0, height - (2 * padding)]);
      // convert date data from string to date object
      let dateArr = dataset.map((item) => new Date(item[0]));

      // generate axes scales
      xAxisScale = d3.scaleTime()
                     .domain([d3.min(dateArr), d3.max(dateArr)])
                     .range([padding, width - padding]);
      yAxisScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (item) => item[1])])
                     .range([height - padding, padding]);
   }

   let generateAxes = () => {
      let xAxis = d3.axisBottom(xAxisScale);
      let yAxis = d3.axisLeft(yAxisScale);
      svg.append('g')
         .call(xAxis)
         .attr('id', 'x-axis')
         .attr('transform', 'translate(0, ' + (height - padding) + ')');
      svg.append('g')
         .call(yAxis)
         .attr('id', 'y-axis')
         .attr('transform', 'translate(' + padding + ', 0)');
   }

   let drawBars = () => {
      let tooltip = d3.select('body')
         .append('div')
         .attr('id', 'tooltip')
         .style('visibility', 'hidden')
         .style('width', 'auto')
         .style('height', 'auto');

      svg.selectAll('rect')
         .data(dataset)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .attr('width', (width - (2 * padding)) / dataset.length)
         .attr('data-date', (item) => item[0])
         .attr('data-gdp', (item) => item[1])
         .attr('x', (item, index) => xScale(index))
         .attr('height', (item) => heightScale(item[1]))
         .attr('y', (item) => (height - padding) - heightScale(item[1]))
         .on('mouseover', (item) => {
            tooltip.transition()
                  .style('visibility', 'visible')

            tooltip.text(item[0] + ", " + item[1])
            document.querySelector('#tooltip').setAttribute('data-date', item[0])
         })
         .on('mouseout', (item) => {
            tooltip.transition()
                  .style('visibility', 'hidden')
         })
   }

   let generateAxesCaption = () => {
      svg.append('text')
         .attr('transform', 'rotate(-90)')
         .attr('x', -220)
         .attr('y', 70)
         .text('Gross Domestic Product');
      svg.append('text')
         .attr('x', 350)
         .attr('y', 600)
         .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
         .attr('class', 'info');
      }


   req.open('GET', url, true);                     // initialize request for data
   req.send();                                     // send request for data
   req.onload = function() {
      dataJSON = JSON.parse(req.responseText);     // parse returned data
      dataset = dataJSON.data;                     // select relevant JSON data part & assign to a variable
      console.log(dataset)
      drawCanvas();
      generateChartTitle('320', '30');
      generateScales();
      generateAxes();
      drawBars();
      generateAxesCaption();
   };


