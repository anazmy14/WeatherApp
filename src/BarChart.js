import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BarChart({ data, dataKeys}) {
  const ref = useRef();
  useEffect(() => {
    const marginY = 70;
    const marginX = 50;
    const width = ref.current.width.baseVal.value - marginX;
    const height = 400 - marginY;
    const xScale = d3
      .scaleBand().padding(0.5)
      .range([marginX, width])
      .domain(data.map((d) => d.month));

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.temp - 5),
        d3.max(data, (d) => d.temp),
      ])
      .range([height, marginY]);

    const container = d3.select(ref.current);
    //  for (let i = 0; i < dataKeys.length; i++) addLine(dataKeys[i], colors[i]);
    container
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .classed("axis", true)
      .call(d3.axisBottom(xScale));
    container
      .append("g")
      .attr("transform", `translate(${marginX},0)`)
      .classed("axis", true)
      .call(d3.axisLeft(yScale));
    container
      .select(".axis")
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 0)
      .attr("dy", "2em")
      .attr("transform", "rotate(330)")
      .style("text-anchor", "end");


      container.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.month); })
      .attr("y", function(d) { return yScale(d.temp); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(d.temp); })
      .on("mouseover", function (_, d) {
        container.append("text")
        .attr("class", "tooltip")
        .attr("x", ()=> xScale(d.month))
        .attr("y",  ()=> yScale(d.temp)-20)
        .text(  d.temp)
       })

       .on("mouseout", ()=>
        container.selectAll(".tooltip").remove()
       )

     
     
    

    // function addLine(key, color) {
    //   container
    //     .append("path")
    //     .datum(data)
    //     .attr("fill", "none")
    //     .attr("stroke", color)
    //     .attr("stroke-width", 5)

    //     .attr(
    //       "d",
    //       d3
    //         .line()
    //         .x(function (d) {
    //           return xScale(d.date);
    //         })
    //         .y(function (d) {
    //           return yScale(d[key]);
    //         })
    //     )
    //     .attr("stroke-dasharray", "0 0")
    //     .attr("stroke-dashoffset", 0)

    //     .transition()
    //     .duration(4000)
    //     .attr("stroke-dashoffset", 0);
    // }

  });

  return (
      <svg ref={ref} width="100%" height={400} />
  );
}
