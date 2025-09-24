import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Paleta de cores
const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1'
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.indigo
];

// Componente de Tooltip customizado
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Gráfico de Linha
export const LineChartComponent = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  color = COLORS.primary,
  height = 300,
  formatter 
}) => (
  <div className="w-full">
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Gráfico de Área
export const AreaChartComponent = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  color = COLORS.primary,
  height = 300,
  formatter 
}) => (
  <div className="w-full">
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Area 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          fill={color}
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// Gráfico de Barras
export const BarChartComponent = ({ 
  data, 
  xKey, 
  yKey, 
  title, 
  color = COLORS.primary,
  height = 300,
  formatter 
}) => (
  <div className="w-full">
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Bar 
          dataKey={yKey} 
          fill={color}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// Gráfico de Pizza
export const PieChartComponent = ({ 
  data, 
  nameKey, 
  valueKey, 
  title, 
  height = 300,
  formatter 
}) => (
  <div className="w-full">
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// Gráfico de Múltiplas Linhas
export const MultiLineChart = ({ 
  data, 
  xKey, 
  lines, 
  title, 
  height = 300,
  formatter 
}) => (
  <div className="w-full">
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color || CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={2}
            name={line.name}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// Gráfico de Barras Empilhadas
export const StackedBarChart = ({ 
  data, 
  xKey, 
  bars, 
  title, 
  height = 300,
  formatter 
}) => (
  <div className="w-full">
    {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey={xKey} 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            stackId="a"
            fill={bar.color || CHART_COLORS[index % CHART_COLORS.length]}
            name={bar.name}
            radius={index === bars.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export { COLORS, CHART_COLORS };