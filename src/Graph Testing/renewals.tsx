import { useEffect, useState } from "react";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import { contracts } from "./data";

const ContractRenwalChart = () => {
  const [chartOptions, setChartOptions] = useState<any>(null);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1).getTime();
    const endOfMarch = new Date(currentYear, 2, 31).getTime();

    // Create data series for all stages
    // Create data series for all stages
    const seriesData = contracts.flatMap((contract, index) =>
      contract.stages.map((stage, stageIndex) => {
        const stageColors = ["#00bbf0", "#fd5959", "#a696c8"];

        return {
          id: `contract-${index}-stage-${stageIndex}`,
          name: `${stage.eventName} (${contract.contract})`,
          start: new Date(stage.eventStartDate).getTime(),
          end: new Date(stage.eventEndDate).getTime(),
          y: index,
          color: stageColors[stageIndex % stageColors.length],
          handledBy: `${stage.handledBy}`,
          note: `${stage.note}`,
        };
      }),
    );

    // Categories for Y-axis labels
    setChartOptions({
      chart: {
        height: Math.max(contracts.length * 50, 600),
        scrollablePlotArea: {
          minWidth: 1000, // Enables horizontal scrolling
        },
      },
      title: {
        text: "Contract Renewal ContractRenwalChart",
      },
      xAxis: {
        type: "datetime",
        min: firstDayOfYear,
        max: endOfMarch,
        tickInterval: 30 * 24 * 3600 * 1000, // Month interval
        dateTimeLabelFormats: {
          month: "%b %Y",
          year: "%Y",
        },
        currentDateIndicator: {
          enabled: false,
          label: {
            allowOverlap: true,
          },
        },
        scrollbar: {
          enabled: false,
        },
      },
      yAxis: {
        type: "category",
        grid: {
          columns: [
            {
              title: { text: "Contract Title" },
              categories: contracts.map((contract) => contract.contract),
            },
            {
              title: { text: "Contract Owner" },
              categories: contracts.map((contract) => contract.owner),
            },
            {
              title: { text: "Annual Value" },
              categories: contracts.map((contract) => contract.value),
            },
          ],
        },
      },

      tooltip: {
        pointFormat:
          "<span><b>Activity:</b> {point.name}</span><br/>" +
          "<span><b>Start:</b> {point.start:%e %b %Y}</span><br/>" +
          "<span><b>End:</b> {point.end:%e %b %Y}</span><br/>" +
          "<span><b>Handled By:</b> {point.handledBy}</span><br/>" +
          "<span><b>Note:</b> {point.note}</span>",
      },

      plotOptions: {
        series: {
          dataLabels: {
            enabled: false,
            format: "{point.name}",
            style: {
              fontWeight: "normal",
              textOverflow: "ellipsis",
            },
          },
        },
      },
      series: [
        {
          name: "Contracts Renewal Stages",
          data: seriesData,
        },
      ],
    });
  }, []);

  if (!chartOptions) return <div>Loading...</div>;

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"ganttChart"}
        options={chartOptions}
      />
      <div className="w-1/4 m-auto flex justify-between items-center">
        <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span className="flex w-3 h-3 bg-[#00bbf0] rounded me-1.5 shrink-0"></span>
          Check-In
        </span>
        <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span className="flex w-3 h-3 bg-[#fd5959] rounded me-1.5 shrink-0"></span>
          Analysis
        </span>
        <span className="flex items-center text-sm font-medium text-gray-900 dark:text-white me-3">
          <span className="flex w-3 h-3 bg-[#a696c8] rounded me-1.5 shrink-0"></span>
          Negotiation
        </span>
      </div>
    </>
  );
};

export default ContractRenwalChart;
