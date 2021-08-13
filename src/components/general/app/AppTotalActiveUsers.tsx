import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
// material
import {
  alpha,
  useTheme,
  experimentalStyled as styled
} from '@material-ui/core/styles';
import { Box, Card, Typography } from '@material-ui/core';
// utils
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { fNumber, fPercent } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1),
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.16)
}));

// ----------------------------------------------------------------------

const PERCENT = 2.6;
// const TOTAL_USER = 22;
const CHART_DATA = [{ data: [10, 2, 18, 32, 19, 12, 18, 48, 5, 10, 22] }];

export default function AppTotalActiveUsers() {
  const theme = useTheme();

  const [numConnected, setNumConnected] = useState<number>(0);
  const { lastMessage, readyState } = useWebSocket(
    'wss://ws-sonar-internal.sonar.circulo.dev',
    {
      shouldReconnect: () => true
    }
  );

  useEffect(() => {
    if (lastMessage) {
      console.log(lastMessage);
      setNumConnected(Number(JSON.parse(lastMessage.data).connected));
    }
  }, [lastMessage]);

  const chartOptions: ApexOptions = {
    colors: [theme.palette.primary.main],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName: number | string) => fNumber(seriesName),
        title: {
          formatter: (seriesName: number | string) => `#${seriesName}`
        }
      },
      marker: { show: false }
    }
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">Total Connected Users</Typography>
        <Box
          sx={{
            mt: 1.5,
            mb: 0.5,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconWrapperStyle
            sx={{
              ...(PERCENT < 0 && {
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.16)
              })
            }}
          >
            <Icon
              width={16}
              height={16}
              icon={PERCENT >= 0 ? trendingUpFill : trendingDownFill}
            />
          </IconWrapperStyle>
          <Typography
            component="span"
            variant="subtitle2"
            color={PERCENT >= 0 ? 'primary' : 'error'}
          >
            {PERCENT > 0 && '+'}
            {fPercent(PERCENT)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {readyState === ReadyState.OPEN ? (
            <>
              <Typography noWrap variant="h3">
                {fNumber(numConnected)}
              </Typography>
              <img
                style={{
                  marginLeft: '5px',
                  marginTop: '7px'
                }}
                width={30}
                src="/static/icons/pulse.svg"
                alt="active users pulse"
              />
            </>
          ) : (
            <Typography noWrap variant="h3">
              Connecting
            </Typography>
          )}
        </Box>
      </Box>

      <ReactApexChart
        type="bar"
        series={CHART_DATA}
        options={chartOptions}
        width={60}
        height={36}
      />
    </Card>
  );
}
