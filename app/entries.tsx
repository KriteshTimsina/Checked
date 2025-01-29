import { StyleSheet, TextInput, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import GorhomBottomSheet from '@gorhom/bottom-sheet';

import { ThemedView } from '@/components/ThemedView';
import BottomSheet from '@/components/BottomSheet';
import EmptyProject from '@/components/EmptyProject';
import InputText from '@/components/InputText';
import Checklist from '@/components/Checklist';
import Button from '@/components/Button';
import { useEntries } from '@/store/entries';
import { haptics } from '@/utils/haptics';

export default function Entries() {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const inputRef = useRef<TextInput>(null);
  const { entries, createEntry, getEntries, isAllCompleted } = useEntries();

  useEffect(() => {
    if (isAllCompleted) {
      router.replace({
        pathname: '/success',
        params: { projectId },
      });
    }
  }, [isAllCompleted, projectId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadEntries = async () => {
        if (projectId && isActive) {
          await getEntries(projectId);
        }
      };

      loadEntries();

      return () => {
        isActive = false;
      };
    }, [getEntries, projectId]),
  );

  const handleAddEntry = async () => {
    if (inputText.trim()) {
      const entry = await createEntry({
        project_id: Number(projectId),
        title: inputText.trim(),
      });
      if (entry) {
        haptics.success();
        closeSheet();
      }
    }
  };

  const openSheet = () => {
    bottomSheetRef.current?.expand();
    inputRef.current?.focus();
  };
  const closeSheet = () => {
    bottomSheetRef.current?.close();
    inputRef.current?.blur();
    setInputText('');
  };

  return (
    <>
      <ThemedView style={styles.container}>
        {entries.length === 0 ? (
          <EmptyProject type="checklist" />
        ) : (
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={entries}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <Checklist item={item} />}
            // style={{ marginBottom: 50 }}
          />
        )}
        <Button onPress={openSheet} />
      </ThemedView>
      <BottomSheet title="Add Task" bottomSheetRef={bottomSheetRef}>
        <InputText
          placeholder="Enter your task title..."
          inputRef={inputRef}
          inputText={inputText}
          setInputText={setInputText}
          onSubmit={handleAddEntry}
          onClose={closeSheet}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
    height: 200,
  },
  scrollContainer: {
    gap: 15,
    marginVertical: 15,
    paddingBottom: 20,
  },
});
