import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

export default function ScreenOne() {

  return (
    <View style={{ width:'100%', height:'100%', backgroundColor: "grey", alignItems: "center", justifyContent: "center" }} >
      <MultiSegmentSlider numberOfSegments={5} onChange={p => console.log(p)}/>
    </View>
  );
}


interface MultiSegmentSliderProps {
  numberOfSegments: number;
  onChange: (segments: number[][]) => void;
}

const MultiSegmentSlider: React.FC<MultiSegmentSliderProps> = ({ numberOfSegments, onChange }) => {
  const [values, setValues] = useState<number[]>(Array.from({ length: numberOfSegments - 1 }, (_, i) => ((i + 1) * 100) / numberOfSegments));

  const handleValuesChange = useCallback((newValues: number[]) => {
    setValues(newValues);
    const segments = [0, ...newValues, 100].map((value, index, array) => {
      if (index === array.length - 1) return null;
      return [value, array[index + 1]];
    }).filter(Boolean) as number[][];
    onChange(segments);
  }, [onChange]);

  return (
    <View style={styles.container}>
      <MultiSlider
        values={values}
        onValuesChange={handleValuesChange}
        min={0}
        max={100}
        step={1}
        allowOverlap={false}
        snapped
      />
      <View style={styles.valuesContainer}>
        {values.map((value, index) => (
          <Text key={index} style={styles.valueText}>{value}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  valueText: {
    fontSize: 16,
  },
});