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

const ContractRenwalChart = () => {
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<Highcharts.Point | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1).getTime();
    const endOfMarch = new Date(currentYear, 2, 31).getTime();

    // Function to handle label formatting
    const labelFormatter = function (
      this: Highcharts.AxisLabelsFormatterContextObject
    ) {
      const contractIndex = this.pos; // Get the index of the current label
      const contract = contracts[contractIndex]; // Find the corresponding contract

      // Check if this label belongs to the first column (Contract Title)
      if (this.axis.categories[contractIndex] === contract.contract) {
        return `<a href="/contract/${contract.contract}" class="hover:text-blue-500 hover:underline" target="_blank">${contract.contract}</a>`;
      }

      // Return plain text for other columns
      return this.value;
    };

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
      title: {
        text: "Contract Renewal ContractRenwalChart",
      },
      xAxis: {
        type: "datetime",
        min: firstDayOfYear,
        max: endOfMarch,
        tickInterval: 30 * 24 * 3600 * 1000,
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
        labels: {
          formatter: labelFormatter,
        },
      },

      tooltip: {
        pointFormat:
          "<span><b>Activity:</b> {point.name}</span><br/>" +
          "<span><b>Start:</b> {point.start:%e %b %Y}</span><br/>" +
          "<span><b>End:</b> {point.end:%e %b %Y}</span><br/>" +
          "<span><b>Counterparty:</b> {point.vendor}</span><br/>" +
          "<span><b>Handled By:</b> {point.handledBy}</span><br/>" +
          "<span><b>Note:</b> {point.note}</span>",
      },

      plotOptions: {
        series: {
          cursor: "pointer",
          dataLabels: {
            enabled: false,
            format: "{point.name}",
            style: {
              fontWeight: "normal",
              textOverflow: "ellipsis",
            },
          },
          point: {
            events: {
              click: function (this: Highcharts.Point) {
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              <p>
                <strong>Event Name:</strong> {selectedItem?.name}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {selectedItem?.start
                  ? new Date(selectedItem.start).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {selectedItem?.end
                  ? new Date(selectedItem.end).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Vendor:</strong> {selectedItem?.vendor || "N/A"}
              </p>
              <p>
                <strong>Handled By:</strong> {selectedItem?.handledBy || "N/A"}
              </p>
              <p>
                <strong>Note:</strong> {selectedItem?.note || "N/A"}
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractRenwalChart;
