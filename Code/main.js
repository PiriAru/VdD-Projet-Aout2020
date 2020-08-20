// Dimensions du graphique et marges
var margin = {top: 10, right: 30, bottom: 30, left: 90},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Ajout du svg
var svg = d3.select("#mon_script")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Lecture des données
d3.csv("Data/Classeur11.csv", function(data) {

    
    var allGroup = d3.map(data, function(d){return(d.region)}).keys()

    // Ajout de la liste déroulante
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) 
      .attr("value", function (d) { return d; }) 

    // Ajout de l'échelle de couleurs
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Axe X
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(17));

    // Axe Y

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.n; })])
      .range([ height, 0 ]);
    

    svg.append("g")
      .call(d3.axisLeft().scale(y));



    
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.region==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.year) })
          .y(function(d) { return y(+d.n) })
        )
        .attr("stroke", function(d){ return myColor("valueA") })
        .style("stroke-width", 4)
        .style("fill", "none")


    function update(selectedGroup) {

 
      var dataFilter = data.filter(function(d){return d.region==selectedGroup})

  
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(+d.n) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

   
    d3.select("#selectButton").on("change", function(d) {
   
        var selectedOption = d3.select(this).property("value")
   
        update(selectedOption)
    })

})
