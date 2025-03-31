import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Contacts from 'expo-contacts'; // For Expo users
import { MaterialIcons } from '@expo/vector-icons'; // For the numpad icon and checkmark icon
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

const Track = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState([]); // State to track selected contacts
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [keyboardType, setKeyboardType] = useState('default'); // State to track keyboard type (default or numeric)
  const [isNumpad, setIsNumpad] = useState(false); // State to manage which icon to show
  const router = useRouter(); // Get the router

  useEffect(() => {
    const getContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync(); // For Expo users

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });
        if (data.length > 0) {
          setContacts(data);
        } else {
          Alert.alert('No contacts found');
        }
      } else {
        Alert.alert('Permission denied', 'Please enable contacts permission to select a friend');
      }
      setIsLoading(false);
    };

    getContacts();
  }, []);

  const handleSelectFriend = (friend) => {
    if (selectedContacts.includes(friend.id)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== friend.id));
    } else {
      setSelectedContacts([...selectedContacts, friend.id]);
    }
  };

  const handleNavigate = () => {
    if (selectedContacts.length > 0) {
      const selectedFriends = contacts.filter((contact) =>
        selectedContacts.includes(contact.id)
      );
      // Pass selected friends data as query to the next page (Tracker.js)
      router.push({
        pathname: '/track/tracker', 
        query: { selectedFriends: JSON.stringify(selectedFriends) }
      });
    } else {
      Alert.alert('No friends selected', 'Please select at least one friend.');
    }
  };
  

  const handleRefresh = () => {
    setSelectedContacts([]); // Clear all selected contacts
  };

  // Filter contacts by both name and phone number
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.phoneNumbers &&
        contact.phoneNumbers.some((phone) =>
          phone.number.replace(/\s+/g, '').includes(searchQuery.replace(/\s+/g, ''))
        ))
  );

  const toggleKeyboard = () => {
    if (isNumpad) {
      setKeyboardType('default'); // Change to default keyboard
    } else {
      setKeyboardType('numeric'); // Change to numeric keyboard
    }
    setIsNumpad(!isNumpad); // Toggle the state for icon display
  };

  return (
    <LinearGradient colors={['#000000', '#121212', '#1c1f2b']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Select Whom to Track</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <MaterialIcons name="refresh" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or number"
          placeholderTextColor="#000"
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardType={keyboardType} // Dynamically set keyboard type
        />
        <TouchableOpacity onPress={toggleKeyboard}>
          <MaterialIcons 
            name={isNumpad ? 'keyboard' : 'dialpad'} 
            size={24} 
            color="#fff" 
            style={styles.numpadIcon} 
          />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Text>Loading contacts...</Text>
      ) : (
        <>
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.contactItem, selectedContacts.includes(item.id) && styles.selectedItem]}
                onPress={() => handleSelectFriend(item)}
              >
                <View style={styles.checkboxContainer}>
                  <View
                    style={[styles.circle, selectedContacts.includes(item.id) && styles.selectedCircle]}
                  >
                    {selectedContacts.includes(item.id) && (
                      <MaterialIcons name="check" size={24} color="white" />
                    )}
                  </View>
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                    <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.selectButton} onPress={handleNavigate}>
            <Text style={styles.selectButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 70,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    marginVertical: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refreshButton: {
    padding: 5,
    backgroundColor: '#007acc',
    borderRadius: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  numpadIcon: {
    marginRight: 10,
  },
  searchInput: {
    height: 40,
    flex: 1,
    backgroundColor: '#D8E3D9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#2b2d38',
    marginVertical: 5,
    borderRadius: 10,
  },
  checkboxContainer: {
    marginRight: 15,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    borderColor: '#007acc',
    backgroundColor: '#007acc',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    color: '#ffffff',
  },
  contactPhone: {
    fontSize: 14,
    color: '#bbb',
  },
  selectButton: {
    backgroundColor: '#c24e13',
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default Track;
