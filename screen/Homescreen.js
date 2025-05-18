import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView
} from "react-native";

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const handleLogout = () => {
    // Implement your logout logic here (e.g., clearing JWT, redirecting to login)
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://t4.ftcdn.net/jpg/04/04/73/39/360_F_404733910_2mIXr6RbC5G3WZJFjopVsBaR3EOM6Bqy.jpg' }}
        style={styles.banner}
        resizeMode="cover"
      />

      <Text style={styles.appName}>Anime Mart</Text>
      <Text style={styles.welcome}>Step into the Anime Realm!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Products')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Explore the Treasured Products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Category')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Discover Mystic Categories</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Inventory')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Open the Inventory Scroll</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },

  banner: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    marginBottom: 30,
  },

  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ff4081',
    fontFamily: 'Arial',
  },

  welcome: {
    fontSize: 20,
    color: '#ddd',
    marginBottom: 30,
    fontWeight: '600',
  },

  button: {
    backgroundColor: '#ff4081',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    width: '70%',
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },

  logoutButton: {
    marginTop: 20,
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '70%',
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  }
});
