import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useRef, useState } from 'react';
import { Colors } from '@/constants/Colors';
import Checkbox, { CheckboxEvent } from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import Animated, { FadeInDown } from 'react-native-reanimated';

type ChecklistProps = {
  item: IEntry;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const Checklist: FC<ChecklistProps> = ({ item }) => {
  const checkedRef = useRef<CheckboxEvent | null>(null);
  const [checked, setChecked] = useState(item.completed);

  const toggleCheckbox = () => {
    setChecked(!checked);
    checkedRef.current?.value === checked ? true : false;
  };

  return (
    <AnimatedButton
      entering={FadeInDown.delay(200)}
      onPress={toggleCheckbox}
      android_ripple={{ color: Colors.light.icon }}
      ref={checkedRef}
      style={styles.container}
    >
      <Checkbox
        style={styles.checkbox}
        color={Colors.highlight}
        value={checked}
        onValueChange={toggleCheckbox}
      />
      <ThemedText
        style={{
          textDecorationLine: checked ? 'line-through' : 'none',
        }}
      >
        {item.title}
      </ThemedText>
    </AnimatedButton>
  );
};
export default Checklist;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: Colors.shade,
    borderRadius: 10,
    minHeight: 60,
    paddingHorizontal: 10,
  },
  checkbox: { borderRadius: 100, width: 25, height: 25 },
});
