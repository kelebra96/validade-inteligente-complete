import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './card';

// Componente de Métrica Individual
export const MetricCard = ({ 
  title, 
  value, 
  previousValue, 
  format = 'number',
  icon: Icon,
  color = 'blue',
  size = 'default'
}) => {
  // Calcular variação percentual
  const calculateChange = () => {
    if (!previousValue || previousValue === 0) return null;
    return ((value - previousValue) / previousValue) * 100;
  };

  const change = calculateChange();
  const isPositive = change > 0;
  const isNegative = change < 0;

  // Formatação de valores
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'decimal':
        return val.toFixed(2);
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  // Classes de cor
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200'
  };

  // Classes de tamanho
  const sizeClasses = {
    small: 'p-4',
    default: 'p-6',
    large: 'p-8'
  };

  return (
    <Card className={`${sizeClasses[size]} ${colorClasses[color]} border-l-4`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color === 'blue' ? 'text-blue-600' : 
                         color === 'green' ? 'text-green-600' :
                         color === 'yellow' ? 'text-yellow-600' :
                         color === 'red' ? 'text-red-600' :
                         color === 'purple' ? 'text-purple-600' :
                         'text-indigo-600'}`}>
            {formatValue(value)}
          </p>
          {change !== null && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : isNegative ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : (
                <Minus className="w-4 h-4 text-gray-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 
                isNegative ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${
            color === 'blue' ? 'bg-blue-100' :
            color === 'green' ? 'bg-green-100' :
            color === 'yellow' ? 'bg-yellow-100' :
            color === 'red' ? 'bg-red-100' :
            color === 'purple' ? 'bg-purple-100' :
            'bg-indigo-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              color === 'blue' ? 'text-blue-600' :
              color === 'green' ? 'text-green-600' :
              color === 'yellow' ? 'text-yellow-600' :
              color === 'red' ? 'text-red-600' :
              color === 'purple' ? 'text-purple-600' :
              'text-indigo-600'
            }`} />
          </div>
        )}
      </div>
    </Card>
  );
};

// Componente de Grid de Métricas
export const MetricsGrid = ({ metrics, columns = 4 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

// Componente de Métrica com Progresso
export const ProgressMetric = ({ 
  title, 
  current, 
  target, 
  format = 'number',
  color = 'blue',
  showPercentage = true 
}) => {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const isComplete = percentage >= 100;

  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {isComplete && (
          <div className="flex items-center text-green-600">
            <ArrowUp className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Meta atingida!</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatValue(current)}
        </span>
        <span className="text-sm text-gray-500">
          de {formatValue(target)}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {showPercentage && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{percentage.toFixed(1)}% concluído</span>
          {!isComplete && (
            <span>{formatValue(target - current)} restante</span>
          )}
        </div>
      )}
    </Card>
  );
};

// Componente de Comparação de Métricas
export const ComparisonMetric = ({ 
  title, 
  current, 
  previous, 
  format = 'number',
  icon: Icon 
}) => {
  const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const isPositive = change > 0;
  const isNegative = change < 0;

  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatValue(current)}
          </p>
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-500">
              Anterior: {formatValue(previous)}
            </span>
            <div className={`flex items-center ${
              isPositive ? 'text-green-600' : 
              isNegative ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {isPositive ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : isNegative ? (
                <ArrowDown className="w-4 h-4 mr-1" />
              ) : (
                <Minus className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        {Icon && (
          <div className="p-3 bg-gray-100 rounded-full">
            <Icon className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>
    </Card>
  );
};