import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Trophy from '@/components/Trophy';
import { useEntries } from '@/store/entries';

import { Colors } from '@/constants/Colors';

const ORIGIN = { x: -10, y: 0 };

export default function Success() {
  const router = useRouter();
  const { resetAllEntriesStatus } = useEntries();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const onResetEntries = async () => {
    const updated = await resetAllEntriesStatus(Number(projectId));

    if (updated) {
      router.back();
    }
  };
  return (
    <ThemedView style={styles.container}>
      <ConfettiCannon count={200} origin={ORIGIN} />
      <Trophy />
      <Animated.Text
        entering={FadeInDown.delay(200)}
        exiting={FadeInDown.delay(400)}
        style={styles.message}
      >
        All tasks completed
      </Animated.Text>
      <Pressable onPress={onResetEntries} style={styles.button}>
        <ThemedText>Reset checklist</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: { fontSize: 16, color: 'black' },
  button: {
    backgroundColor: Colors.dark.background,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '50%',
  },
});
