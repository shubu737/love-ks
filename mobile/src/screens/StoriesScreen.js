import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { storiesAPI } from '../services/api';
import SocketService from '../services/socket';

const StoriesScreen = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    loadStories();
    setupSocketListeners();

    return () => {
      SocketService.off('story-created', handleStoryCreated);
      SocketService.off('story-deleted', handleStoryDeleted);
    };
  }, []);

  const loadStories = async () => {
    setLoading(true);
    try {
      const response = await storiesAPI.getStories();
      setStories(response.data.stories || []);
    } catch (error) {
      console.error('Error loading stories:', error);
      Alert.alert('Error', 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    SocketService.on('story-created', handleStoryCreated);
    SocketService.on('story-deleted', handleStoryDeleted);
  };

  const handleStoryCreated = (data) => {
    if (data && data.id) {
      setStories((prev) => [data, ...prev]);
    }
  };

  const handleStoryDeleted = (data) => {
    const storyId = data?.id || data;
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  const handleCreateStory = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await storiesAPI.createStory(title, content, new Date());
      setTitle('');
      setContent('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating story:', error);
      Alert.alert('Error', 'Failed to create story');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStory = async (id) => {
    Alert.alert('Delete Story', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await storiesAPI.deleteStory(id);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete story');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff6b9d" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {!showForm && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowForm(true)}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.createText}>New Story</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Story Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
            editable={!submitting}
          />
          <TextInput
            style={[styles.contentInput, { textAlignVertical: 'top' }]}
            placeholder="Write your story..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
            editable={!submitting}
          />
          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowForm(false);
                setTitle('');
                setContent('');
              }}
              disabled={submitting}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]}
              onPress={handleCreateStory}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Story</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {stories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No stories yet</Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.storyCard}>
              <View style={styles.storyHeader}>
                <View style={styles.storyTitleContainer}>
                  <Text style={styles.storyTitle}>{item.title}</Text>
                  <Text style={styles.storyDate}>
                    {new Date(item.story_date).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteStory(item.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#ff6b9d" />
                </TouchableOpacity>
              </View>
              <Text style={styles.storyContent} numberOfLines={3}>
                {item.content}
              </Text>
            </View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#ff6b9d',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  contentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    height: 100,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  submitButton: {
    backgroundColor: '#ff6b9d',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  storyCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b9d',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  storyTitleContainer: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  storyDate: {
    fontSize: 12,
    color: '#999',
  },
  storyContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});

export default StoriesScreen;
