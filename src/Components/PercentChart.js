import * as d3 from "d3";

export default function PercentChart({ value = 50, isPercent=true, levels=[ 25, 50, 75, 100]}) {
  const greenArc = d3
    .arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(-Math.PI / 2)
    .endAngle(-Math.PI / 4)
    .padAngle(0)
    .cornerRadius(2)();

  const yellowArc = d3
    .arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(-Math.PI / 4)
    .endAngle(0)
    .padAngle(0)
    .cornerRadius(2)();

  const orangeArc = d3
    .arc()
    .innerRadius(1)
    .outerRadius(0.9)
    .startAngle(0)
    .endAngle(Math.PI / 4)
    .padAngle(0)
    .cornerRadius(2)();

  const redArc = d3
    .arc()
    .innerRadius(1)
    .startAngle(Math.PI / 4)
    .outerRadius(0.9)
    .endAngle(Math.PI / 2)
    .padAngle(0)
    .cornerRadius(2)();

  const percentScale = d3.scaleLinear().domain([0, levels[3]]).range([0, 1]);
  const percent = percentScale(value);
  const angleScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);
  const angle = angleScale(percent);

  const offset = 1 - (1 - 0.9) / 2;

  const markerLocation = [
    Math.cos(angle - Math.PI / 2) * offset,
    Math.sin(angle - Math.PI / 2) * offset,
  ];

  const getBlobColor = () => {
    if (value >= 0 && value <= levels[0] ) return "#01FF70";
    if (value > levels[0]  && value <= levels[1] ) return "#fbec5d";
    if (value > levels[1]  && value <= levels[2] ) return "#FF851B";
    if (value >= levels[2] ) return "#FF4136";
  };

  return (
    <svg height={200} width={200} viewBox={[-1, -1, 2, 1].join(" ")}>
      <path d={redArc} fill="#FF4136" />
      <path d={orangeArc} fill="#FF851B" />
      <path d={greenArc} fill="#01FF70" />
      <path d={yellowArc} fill="#fbec5d" />
      <circle
        cx={markerLocation[0]}
        cy={markerLocation[1]}
        r="0.07"
        strokeWidth="0.04"
        fill="#578fc7"
        stroke={getBlobColor(value)}
      />

      <text x={0} y={-0.1} className="percent" fill={getBlobColor(value)}>
        {" "}
        {value}
        {isPercent && "%"}
      </text>
    </svg>
  );
}
