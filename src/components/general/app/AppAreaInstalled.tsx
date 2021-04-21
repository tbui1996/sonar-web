import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_DATA = [
  { name: 'Acknowledged', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
  { name: 'Unacknowledged', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] }
];

export default function AppAreaInstalled() {
  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      stacked: true,
      zoom: { enabled: true }
    },
    xaxis: {
      categories: [
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr'
      ]
    }
  });

  return (
    <Card>
      <CardHeader
        title="Whisper Acknowledgement"
        subheader="(+12%) than last month"
      />
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={CHART_DATA}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
