import { useEffect, useState } from "react";
import Highcharts from "highcharts/highcharts-gantt";
import HighchartsReact from "highcharts-react-official";
import { contracts } from "./data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomPoint extends Highcharts.Point {
  start: number;
  end: number;
  vendor: string;
  handledBy: string;
  note: string;
}

const ContractRenwalChart = () => {
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<CustomPoint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1).getTime();
    const endOfMarch = new Date(currentYear, 2, 31).getTime();

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
          vendor: `${contract.vendor}`,
        };
      })
    );

    // Categories for Y-axis labels
    setChartOptions({
      chart: {
        height: Math.max(contracts.length * 50, 600),
        scrollablePlotArea: {
          minWidth: 1000,
        },
        backgroundColor: "transparent",
      },
      accessibility: {
        enabled: false,
        keyboardNavigation: {
          seriesNavigation: {
            mode: "serialize",
          },
        },
      },
      title: {
        text: "Contract Renewal Chart",
      },
      xAxis: {
        type: "datetime",
        min: firstDayOfYear,
        max: endOfMarch,
        tickInterval: 30 * 24 * 3600 * 1000,
        currentDateIndicator: {
          enabled: true,
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
        categories: contracts.map((contract) => contract.contract),
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
        labels: {
          useHTML: false,
          formatter: function (
            this: Highcharts.AxisLabelsFormatterContextObject
          ) {
            const contractIndex = this.pos;
            const contract = contracts[contractIndex];

            if (this.axis.categories[contractIndex] === contract.contract) {
              return `<a href=${`/contract/${contract.contract}`} class="hover:underline hover:text-blue-500 cursor-pointer">${
                contract.contract
              }</a>`;
            }
            return this.value;
          },
        },
      },
      tooltip: {
        pointFormat:
          "<span><b>Activity:</b> {point.name}</span><br/>" +
          "<span><b>Start:</b> {point.start:%e %b %Y}</span><br/>" +
          "<span><b>End:</b> {point.end:%e %b %Y}</span><br/>" +
          "<span><b>Counterparty:</b> {point.vendor}</span><br/>" +
          "<span><b>Assigned To:</b> {point.handledBy}</span><br/>" +
          "<span><b>Note:</b> {point.note}</span>",
      },

      plotOptions: {
        series: {
          cursor: "pointer",
          dataLabels: {
            enabled: false,
          },
          point: {
            events: {
              click: function (this: CustomPoint) {
                setSelectedItem(this); // Pass the clicked item
                setIsDialogOpen(true); // Open the dialog
              },
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
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"ganttChart"}
        options={chartOptions}
      />

      <div className="w-1/4 m-auto flex justify-between items-center pb-4">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>
              {selectedItem?.category}
              <Button variant="default">Add Note</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractRenwalChart;
