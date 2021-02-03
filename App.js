import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, FlatList, Linking, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

export default function App() {

  const [contacts, setContacts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [permissions, setPermissions] = useState(false);

  const showContacts = async () => {
    // get all my phone contacts
    const contactList = await Contacts.getContactsAsync();
    setContacts(contactList.data);
  }

  const getPermissions = async () => {
    const {status} = await Permissions.askAsync(Permissions.CONTACTS);
    const {status1} = await MediaLibrary.requestPermissionsAsync(Permissions.MediaLibrary);
    console.log({status});
    if(status === 'granted' && status1 === 'granted'){
      setPermissions(true);
    } else { setPermissions(false) }
  }

  const call = contact => {
    let phoneNumber = contact.phoneNumbers[0].number.replace(/[\(\)\-\s+]/g, '');
    let link = `tel:${phoneNumber}`;
    Linking.canOpenURL(link)
      .then((supported) => Linking.openURL(link) )
      .catch(console.error);
  };

  useEffect( () => {
    getPermissions();
  }, [])

  // const savePicture = async () => {
  //   CameraRoll.save(tag, { type, album })
  // };
  
  // abc() {
  //   getPackages().add(new CameraRoll())
  // }

  
  const showImages = async () => {
    const imageList = await MediaLibrary.getAssetsAsync({mediaType: MediaLibrary.MediaType.photo});
    setAlbums(imageList.assets);
    console.log("Album List Count: ", imageList.assets.length);
    // console.log(("Album.name ", albumsList.assets));
  }

  return (
    <View style={styles.container}>
      <Text>Hello, World!</Text>

      <Button
        onPress={showContacts}
        title="Show Contacts"
      ></Button>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <Button title={item.name} onPress={() => call(item)} />}
      ></FlatList>

      <Button
        onPress={() => showImages()}
        title="Show Images"
      ></Button>

      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => {
          console.log("item.uri!!!!!!" , item.uri);
        return <Image style={{width: 50, height: 50}} source={{uri: item.uri }}  />}}
      
      ></FlatList>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
