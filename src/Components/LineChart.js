import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
export default function LineChart({ data, dataKeys, colors }) {
  const ref = useRef();
  const [screenWidth, setScreenWidth] = useState(0);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    createChart(data);
    return function cleanup() {
      d3.select(ref.current).selectAll("*").remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [screenWidth, data]);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const createChart = (data) => {
    const marginX = 60;
    const marginY = 70;
    const width = Math.min(1400, window.innerWidth) - marginX;
    const height = 400 - marginY;
    const xScale = d3
      .scalePoint()
      .range([marginX, width])
      .domain(data.map((d) => d.date));
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Number(d.minTemp) - 5),
        d3.max(data, (d) => Number(d.maxTemp)),
      ])
      .range([height, marginY]);

    const container = d3.select(ref.current);

    //Draw the 3 data lines
    for (let i = 0; i < dataKeys.length; i++) {
      addLine(dataKeys[i], colors[i]);
      container
        .append("rect")
        .attr("x", width / 2)
        .attr("y", i * 20)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", colors[i]);
      container
        .append("text")
        .attr("x", width / 2 + 30)
        .attr("y", i * 20 + 10)
        .text(dataKeys[i])
        .style("fill", colors[i])
        .style("font-size", 14);
    }
    container
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .classed("axis", true)
      .call(
        d3
          .axisBottom(xScale)
          .tickFormat((date) =>
            new Date(date).toLocaleString("en-us", { weekday: "long" })
          )
          .tickValues(data.map((day) => day.date))
      );

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

    function addLine(key, color) {
      container
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return xScale(d.date);
            })
            .y(function (d) {
              return yScale(d[key]);
            })
        );
    }
  };

  return <svg ref={ref} width="100%" height="400" />;
}
