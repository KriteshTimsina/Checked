import { StyleSheet } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { ThemedText } from './ThemedText';
import LottieView from 'lottie-react-native';
import emptyProject from '@/assets/lottie/empty-state.json';
import { ThemedView } from './ThemedView';

const TITLE = {
  project: 'No Projects. Add one to view.',
  checklist: 'Checklist is empty. Add one to view.',
  notes: 'Notes is empty. Add one to view.',
};

type EmptyProjectProps = {
  type?: 'project' | 'checklist' | 'notes';
};

const EmptyProject: FC<EmptyProjectProps> = ({ type = 'project' }) => {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    const current = animation.current;
    if (!current) return;
    current?.play();

    return () => current?.pause();
  }, []);
  return (
    <ThemedView style={styles.container}>
      <LottieView autoPlay ref={animation} style={styles.empty} source={emptyProject} />
      <ThemedText style={{ textAlign: 'center' }}>{TITLE[type]}</ThemedText>
    </ThemedView>
  );
};

export default EmptyProject;

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  empty: {
    width: 200,
    height: 200,
  },
});
