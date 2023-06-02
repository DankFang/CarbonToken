import ReactEcharts from 'echarts-for-react';
import React from 'react';

function EchartsCircle(props) {
  const { emission, remain } = props;
  console.log(emission,remain,)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left:50,
      top: 'middle',
      itemGap: 10,
      textStyle: {
        fontSize: 10,
        fontWeight: 'bold',
      },
      data: ['Emssion', 'CT Remain'],
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '70%'],
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ffffff',
        },
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: '{d}%',
          fontSize: 20,
          fontWeight: 'bold',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 30,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 0,
        },
        data: [
          { value: emission, name: 'Emssion' },
          { value: remain, name: 'CT Remain' },
        ],
      },
    ],
  };

  return (
    <ReactEcharts
      option={option}
      style={{ height: '100%', width: '100%' }}
    />
  );
}

export default EchartsCircle;