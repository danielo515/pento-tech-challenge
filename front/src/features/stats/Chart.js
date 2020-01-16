import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { XAxis, YAxis, Label, ResponsiveContainer,BarChart, Bar, CartesianGrid, Tooltip, Legend, } from 'recharts';
import Title from './Title';
import PropTypes from 'prop-types'

function  stringToColour(str='') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export default function Chart({sessions, title, names}) {
  const theme = useTheme();
  const Bars = names.map (x=>  <Bar dataKey={x} name={x} stackId='a' fill={stringToColour(x)} />)
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <ResponsiveContainer height='100%'>
        <BarChart
          data={sessions}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 40,
          }}
        >
          <XAxis dataKey="startDate" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Minutes
            </Label>
          </YAxis>
          <CartesianGrid strokeDasharray="3 3" />
          <Legend/>
          <Tooltip/>
          {Bars}
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}

Chart.propTypes = {
  title: PropTypes.string,
  sessions: PropTypes.arrayOf(PropTypes.shape({
    duration: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),),
};
Chart.defaultProps = {
  sessions: []
};
