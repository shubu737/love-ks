import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>We are</Text>
        <Text style={styles.names}>{user?.name}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <MaterialIcons name="photo" size={32} color="#ff6b9d" />
          <Text style={styles.statLabel}>Gallery</Text>
        </View>
        <View style={styles.stat}>
          <MaterialIcons name="favorite" size={32} color="#ff6b9d" />
          <Text style={styles.statLabel}>Stories</Text>
        </View>
        <View style={styles.stat}>
          <MaterialIcons name="note" size={32} color="#ff6b9d" />
          <Text style={styles.statLabel}>Notes</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Features</Text>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('Gallery')}
        >
          <MaterialIcons name="photo-library" size={40} color="#ff6b9d" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Gallery</Text>
            <Text style={styles.featureDesc}>Share your moments</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ff6b9d" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('Stories')}
        >
          <MaterialIcons name="favorite" size={40} color="#ff6b9d" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Love Stories</Text>
            <Text style={styles.featureDesc}>Write your love story</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ff6b9d" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('Notes')}
        >
          <MaterialIcons name="note" size={40} color="#ff6b9d" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Notes</Text>
            <Text style={styles.featureDesc}>Secret memories</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ff6b9d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff6b9d',
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  names: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b9d',
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff6b9d',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
