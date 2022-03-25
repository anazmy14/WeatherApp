import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

export default function BarChart({ data }) {
  const ref = useRef();
  const [screenWidth, setScreenWidth] = useState();

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    createChart();
    return function cleanup() {
      d3.select(ref.current).selectAll("*").remove();
      window.removeEventListener("resize", handleResize);
    };
  }, [screenWidth, data]);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const createChart = () => {
    const width = Math.min(1400, window.innerWidth);
    const radius = Math.min(width / 2, 170);

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.month))
      .range([
        "#34568B",
        "#FF6F61",
        "#6B5B95",
        "#88B04B",
        "#F7CAC9",
        "#92A8D1",
        "#955251",
        "#B565A7",
        "#009B77",
        "#DD4124",
        "#45B8AC",
        "#EFC050",
      ]);

    const container = d3.select(ref.current);
    const g = container
      .append("g")
      .attr("transform", `translate(${width / 2 - 7}, ${radius} )`);
    const pie = d3.pie().value((d) => d.value);
    const arc = g
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "slice");

    const path = d3.arc().outerRadius(radius).innerRadius(0);

    arc
      .append("path")
      .attr("d", path)
      .attr("fill", (d) => colorScale(d.data.month));

    g.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("text")
      .text((d) => d.data.month)
      .attr("y", (_, i) => radius + 60 + Math.floor(i / 2) * 17 - 10)
      .attr("x", (_, i) => (i % 2) * radius - 100)
      .style("text-anchor", "start")
      .style("font-size", 14)
      .style("fill", "white");

    g.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("rect")
      .text((d) => d.data.month)
      .attr("y", (_, i) => radius + 60 + Math.floor(i / 2) * 17 - 10 - 10)
      .attr("x", (_, i) => (i % 2) * radius - 100 - 30)
      .attr("width", 20)
      .attr("height", 10)
      .style("fill", (d) => colorScale(d.data.month));
  };

  return <svg ref={ref} width="100%" height={600} />;
}
