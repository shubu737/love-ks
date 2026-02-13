import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PhotoDetailScreen = ({ route }) => {
  const { photo } = route.params || {};

  if (!photo) {
    return (
      <View style={styles.container}>
        <Text>Photo not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: `http://localhost:5000/uploads/${photo.filename}` }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{photo.title}</Text>
        <Text style={styles.description}>{photo.description}</Text>
        <View style={styles.meta}>
          <MaterialIcons name="calendar-today" size={16} color="#999" />
          <Text style={styles.date}>
            {new Date(photo.photo_date).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});

export default PhotoDetailScreen;
