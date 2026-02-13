import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { galleryAPI } from '../services/api';
import SocketService from '../services/socket';

const GalleryScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPhotos();
    setupSocketListeners();

    return () => {
      SocketService.off('photo-uploaded', handlePhotoUploaded);
      SocketService.off('photo-deleted', handlePhotoDeleted);
    };
  }, []);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const response = await galleryAPI.getPhotos();
      setPhotos(response.data.photos || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    SocketService.on('photo-uploaded', handlePhotoUploaded);
    SocketService.on('photo-deleted', handlePhotoDeleted);
  };

  const handlePhotoUploaded = (data) => {
    if (data && data.id) {
      setPhotos((prev) => [data, ...prev]);
    }
  };

  const handlePhotoDeleted = (data) => {
    const photoId = data || data.id;
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const compressImage = async (uri) => {
    try {
      const result = await ImageManipulator.manipulateAsync(uri, [
        { resize: { width: 1920, height: 1920 } },
      ]);

      return result.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadPhoto = async (uri) => {
    setUploading(true);
    try {
      const compressedUri = await compressImage(uri);

      const formData = new FormData();
      formData.append('photo', {
        uri: compressedUri,
        name: `photo-${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
      formData.append('title', 'Memory');
      formData.append('description', 'A beautiful moment');

      await galleryAPI.uploadPhoto(formData);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id) => {
    Alert.alert('Delete Photo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await galleryAPI.deletePhoto(id);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete photo');
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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickImage}
        disabled={uploading}
      >
        <MaterialIcons
          name={uploading ? 'hourglass-empty' : 'add-a-photo'}
          size={24}
          color="#fff"
        />
        <Text style={styles.uploadText}>
          {uploading ? 'Uploading...' : 'Add Photo'}
        </Text>
      </TouchableOpacity>

      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="image-not-supported" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No photos yet</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          rendering={({ item }) => (
            <View style={styles.photoContainer}>
              <Image
                source={{
                  uri: `http://localhost:5000/uploads/${item.filename}`,
                }}
                style={styles.photo}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePhoto(item.id)}
              >
                <MaterialIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.photoContainer}>
              <Image
                source={{
                  uri: `http://localhost:5000/uploads/${item.filename}`,
                }}
                style={styles.photo}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deletePhoto(item.id)}
              >
                <MaterialIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
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
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#ff6b9d',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  photoContainer: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
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

export default GalleryScreen;
