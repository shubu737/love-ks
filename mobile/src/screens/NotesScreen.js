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
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { notesAPI } from '../services/api';
import SocketService from '../services/socket';

const CATEGORIES = ['general', 'anniversary', 'reminder', 'dreams', 'bucket-list'];

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  useEffect(() => {
    loadNotes();
    setupSocketListeners();

    return () => {
      SocketService.off('note-created', handleNoteCreated);
      SocketService.off('note-deleted', handleNoteDeleted);
    };
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      Alert.alert('Error', 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    SocketService.on('note-created', handleNoteCreated);
    SocketService.on('note-deleted', handleNoteDeleted);
  };

  const handleNoteCreated = (data) => {
    if (data && data.id) {
      setNotes((prev) => [data, ...prev]);
    }
  };

  const handleNoteDeleted = (data) => {
    const noteId = data?.id || data;
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await notesAPI.createNote(title, content, selectedCategory);
      setTitle('');
      setContent('');
      setSelectedCategory('general');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating note:', error);
      Alert.alert('Error', 'Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNote = async (id) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await notesAPI.deleteNote(id);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete note');
          }
        },
      },
    ]);
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: '#ff6b9d',
      anniversary: '#ff1493',
      reminder: '#ff69b4',
      dreams: '#ffc0cb',
      'bucket-list': '#ffd4e5',
    };
    return colors[category] || '#ff6b9d';
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
          <Text style={styles.createText}>New Note</Text>
        </TouchableOpacity>
      )}

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
            editable={!submitting}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryPill,
                  selectedCategory === category && styles.categoryPillSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            style={[styles.contentInput, { textAlignVertical: 'top' }]}
            placeholder="Write your note..."
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
                setSelectedCategory('general');
              }}
              disabled={submitting}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]}
              onPress={handleCreateNote}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Note</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="note" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No notes yet</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={[styles.noteCard, { borderTopColor: getCategoryColor(item.category) }]}>
              <View style={styles.noteHeader}>
                <Text style={styles.noteCategor}>{item.category}</Text>
                <TouchableOpacity onPress={() => deleteNote(item.id)}>
                  <MaterialIcons name="delete" size={18} color="#ff6b9d" />
                </TouchableOpacity>
              </View>
              <Text style={styles.noteTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.noteContent} numberOfLines={3}>
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
  categoryScroll: {
    marginBottom: 12,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  categoryPillSelected: {
    backgroundColor: '#ff6b9d',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
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
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  noteCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteCategor: {
    fontSize: 11,
    color: '#ff6b9d',
    fontWeight: '600',
    backgroundColor: '#fff0f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  noteContent: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
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

export default NotesScreen;
