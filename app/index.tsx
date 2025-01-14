import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

import { Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useEffect, useRef, useState } from 'react';
import { IProject, projects as projectsSchema } from '@/db/schema';

import Button from '@/components/Button';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import ProjectItem from '@/components/ProjectItem';
import EmptyProject from '@/components/EmptyProject';
import { toast } from '@/utils/toast';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { getDb } from '@/utils/db';
import { useProject, useProjectStore } from '@/store/projects';

export default function Home() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const db = getDb();
  const { projects, getAllProjects, createProject } = useProject();

  useEffect(() => {
    getAllProjects();
  }, []);

  const onAddProject = async () => {
    const created = await createProject({
      title: inputText,
      description: 'Testing',
      createdAt: new Date(),
    });

    if (created) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      closeSheet();
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pressable onPress={closeSheet} style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle">Projects</ThemedText>
          <ScrollView
            refreshControl={
              <RefreshControl
                colors={[Colors.primary]}
                refreshing={loading}
                onRefresh={getAllProjects}
              />
            }
          >
            <View style={styles.projectContainer}>
              {projects.length > 0 ? (
                projects.map((item, index) => {
                  return <ProjectItem key={index} item={item} index={index} />;
                })
              ) : (
                <EmptyProject />
              )}
            </View>
          </ScrollView>
          <Button onPress={openSheet} />
        </ThemedView>
      </Pressable>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: Colors.primary, marginBottom: 20 }}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              Add New Task
            </ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                multiline
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter your task title..."
                placeholderTextColor="white"
                style={styles.input}
              />

              <View style={styles.buttonContainer}>
                <Pressable hitSlop={5} onPress={closeSheet} style={styles.iconButton}>
                  <Ionicons name="close-outline" size={25} color="white" />
                </Pressable>

                <Pressable
                  onPress={onAddProject}
                  style={[styles.iconButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
                >
                  <Ionicons name="paper-plane-outline" size={25} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  projectContainer: {
    gap: 10,
    marginVertical: 20,
  },
  contentContainer: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 10,
    height: 200,
  },
  sheetTitle: {
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: Colors.dark.shade,
    borderRadius: 10,
    padding: 10,
  },
  input: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
    marginTop: 10,
  },
  iconButton: {
    padding: 5,
  },
  addButton: {
    backgroundColor: Colors.highlight,
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
