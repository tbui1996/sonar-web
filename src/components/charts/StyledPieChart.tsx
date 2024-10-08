import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import {
  useTheme,
  experimentalStyled as styled
} from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
import { fNumber } from '../../utils/formatNumber';
import BaseOptionChart from './BaseOptionChart';
import { StyledPieChartProps } from '../../@types/chart';
// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important' as 'relative',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------
export default function StyledPieChart({
  labels,
  data,
  title
}: StyledPieChartProps) {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.primary.dark
    ],
    labels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: string) => fNumber(seriesName),
        title: {
          formatter: (seriesName: string) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (val: number | string) => fNumber(val)
            },
            total: {
              formatter: (w: { globals: { seriesTotals: number[] } }) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              }
            }
          }
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader title={title} />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart
          type="donut"
          series={data}
          options={chartOptions}
          height={280}
        />
      </ChartWrapperStyle>
    </Card>
  );
}
