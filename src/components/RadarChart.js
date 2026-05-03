import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../constants/theme';

/**
 * Gráfico radar personalizado para mostrar compatibilidad multidimensional.
 * Cada eje representa un factor del matching de IA.
 */
const RadarChart = ({ data, size = 200, color = COLORS.primary }) => {
  const center = size / 2;
  const radius = (size / 2) - 30;
  const angleStep = (2 * Math.PI) / data.length;
  const levels = 5; // Niveles del grid

  // Calcular puntos del polígono de datos
  const getPoint = (index, value) => {
    const angle = (angleStep * index) - (Math.PI / 2); // Empezar arriba
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generar puntos del polígono de datos
  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPolygonStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generar grid (pentágonos concéntricos)
  const gridPolygons = [];
  for (let level = 1; level <= levels; level++) {
    const levelRadius = (level / levels) * radius;
    const points = data.map((_, i) => {
      const angle = (angleStep * i) - (Math.PI / 2);
      return {
        x: center + levelRadius * Math.cos(angle),
        y: center + levelRadius * Math.sin(angle),
      };
    });
    gridPolygons.push(points.map(p => `${p.x},${p.y}`).join(' '));
  }

  // Puntos para las etiquetas
  const labelPoints = data.map((d, i) => {
    const angle = (angleStep * i) - (Math.PI / 2);
    const labelR = radius + 22;
    return {
      x: center + labelR * Math.cos(angle),
      y: center + labelR * Math.sin(angle),
      label: d.label,
      value: d.value,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Grid lines */}
        {gridPolygons.map((poly, i) => (
          <Polygon
            key={`grid-${i}`}
            points={poly}
            fill="none"
            stroke={COLORS.border}
            strokeWidth={1}
            opacity={0.5}
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = (angleStep * i) - (Math.PI / 2);
          const endX = center + radius * Math.cos(angle);
          const endY = center + radius * Math.sin(angle);
          return (
            <Line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke={COLORS.border}
              strokeWidth={1}
              opacity={0.4}
            />
          );
        })}

        {/* Data polygon (filled) */}
        <Polygon
          points={dataPolygonStr}
          fill={color}
          fillOpacity={0.15}
          stroke={color}
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <Circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={color}
            stroke={COLORS.white}
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {labelPoints.map((lp, i) => (
          <SvgText
            key={`label-${i}`}
            x={lp.x}
            y={lp.y}
            fontSize={10}
            fontWeight="600"
            fill={COLORS.textSecondary}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {lp.label}
          </SvgText>
        ))}
      </Svg>

      {/* Score labels below chart */}
      <View style={styles.scoresRow}>
        {data.map((d, i) => (
          <View key={i} style={styles.scoreItem}>
            <View style={[styles.scoreDot, { backgroundColor: d.value >= 70 ? COLORS.primary : d.value >= 40 ? COLORS.warning : COLORS.error }]} />
            <Text style={styles.scoreLabel}>{d.label}</Text>
            <Text style={[styles.scoreValue, { color: d.value >= 70 ? COLORS.primary : d.value >= 40 ? COLORS.warning : COLORS.error }]}>{d.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scoresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  scoreLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  scoreValue: {
    fontSize: 10,
    fontWeight: '700',
  },
});

export default RadarChart;
