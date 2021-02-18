import React, { useEffect, useState, createRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconUser from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@env';
import ActionSheet from 'react-native-actions-sheet';
import { Input } from 'react-native-elements';

const PersonalInformation = ({ navigation }) => {
  const actionSheetRef = createRef();
  const actionSheetRef2 = createRef();

  const token = useSelector((state) => state.authReducer.token);
  const [userData, setUserData] = useState({});
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [textBtn, setTextBtn] = useState('Save')
  const config = {
    headers: {
      'x-access-token': 'bearer ' + token,
    },
  };

  const changeFirstname = () => {
    setTextBtn('Please Wait')
    const body = {
      firstname: firstName
    }
    axios.patch(API_URL + `/user/changeInfo`, body, config)
      .then(({ data }) => {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        navigation.replace('Personal')
      }).catch(({ response }) => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      })
  }

  const changeLastName = () => {
    setTextBtn('Please Wait')
    const body = {
      lastname: lastName
    }
    axios.patch(API_URL + `/user/changeInfo`, body, config)
      .then(({ data }) => {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        navigation.replace('Personal')
      }).catch(({ response }) => {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      })
  }

  useEffect(() => {

    axios
      .get(API_URL + `/user/myProfile`, config)
      .then(({ data }) => {
        // console.log('ini halaman personal info')
        setUserData(data.data);
        setFirstName(data.data.firstname)
        setLastName(data.data.lastname)
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  }, []);
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6379F4"
        translucent={true}
      />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginTop: 20 }}
            onPress={() => {
              navigation.replace('Profile')
            }}>
            <Icon name="arrow-left" color="white" size={30} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 10,
              marginTop: 20,
              color: 'white',
              fontSize: 20,
              fontWeight: '700',
              lineHeight: 30,
            }}>
            Personal Information
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            We got your personal information from the sign up proccess. If you
            want to make changes on your information, contact our support.
          </Text>
          <View style={styles.list}>
            <Text style={styles.listTitle}>First Name</Text>
            <Text style={styles.subTitle}>
              {userData !== undefined ? userData.firstname : ''}
            </Text>
            <Text
              style={styles.manage}
              onPress={() => actionSheetRef.current?.setModalVisible()}
            >
              Change
              </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.listTitle}>Last Name</Text>
            <Text style={styles.subTitle}>
              {userData !== undefined ? userData.lastname : ''}
            </Text>
            <Text
              style={styles.manage}
              onPress={() => actionSheetRef2.current?.setModalVisible()}
            >
              Change
              </Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.listTitle}>Verifed E-mail</Text>
            <Text style={styles.subTitle}>
              {userData !== undefined ? userData.email : ''}
            </Text>
          </View>
          <View style={styles.list}>
            <Text
              style={styles.listTitle}
              onPress={() => {
                navigation.navigate('AddNumber');
              }}>
              Phone Number
            </Text>
            <Text style={styles.subTitle}>
              {userData !== undefined ? userData.phone : ''}
            </Text>
            <Text
              style={styles.manage}
              onPress={() => {
                navigation.navigate('Manage');
              }}>
              manage
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Sheet  FirstName*/}
      <ActionSheet ref={actionSheetRef}>
        <KeyboardAvoidingView>
          <View style={styles.list}>
            <Text style={styles.listTitle}>First Name</Text>
            <TextInput
              style={styles.subTitle}
              value={userData !== undefined ? firstName : ''}
              placeholder="Edit First Name"
              onChangeText={(text) => {
                setFirstName(text);
              }}
            />
          </View>
          <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
            <TouchableOpacity style={styles.btnTransfer}
              onPress={changeFirstname}
            >
              <Text style={{ color: '#fff', fontSize: 18, marginTop: 10 }}>
                {textBtn}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ActionSheet>

      {/* Action Sheet  Lastname*/}
      {/* Aku bikin 2 kaya gini mas, kalo mau di konditional rendering ya monggo */}
      <ActionSheet ref={actionSheetRef2}>
        <KeyboardAvoidingView>
          <View style={styles.list}>
            <Text style={styles.listTitle}>Last Name</Text>
            <TextInput
              style={styles.subTitle}
              value={userData !== undefined ? lastName : ''}
              placeholder="Edit Last Name"
              onChangeText={(text) => {
                setLastName(text);
              }}
            />
          </View>
          <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
            <TouchableOpacity style={styles.btnTransfer}
              onPress={changeLastName}
            >
              <Text style={{ color: '#fff', fontSize: 18, marginTop: 10 }}
              >
                {textBtn}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ActionSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    // backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 110,
    padding: 20,
    backgroundColor: '#6379F4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 40,
    color: '#7A7886',
    fontSize: 16,
  },
  list: {
    backgroundColor: 'white',
    padding: 10,
    height: 75,
    justifyContent: 'space-around',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 0.2,
    borderColor: '#EAECEE',
    elevation: 0.5,
  },
  noteInput: {
    borderRadius: 10,
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0.2,
    borderColor: '#EAECEE',
    elevation: 0.5,
  },
  listTitle: {
    color: '#7A7886',
    fontSize: 16,
  },
  subTitle: {
    color: '#514F5B',
    fontSize: 22,
    fontWeight: 'bold',
  },
  manage: {
    position: 'absolute',
    right: 10,
    top: '50%',
    color: '#6379F4',
    fontSize: 16,
  },
  btnTransfer: {
    backgroundColor: '#6379F4',
    borderRadius: 10,
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default PersonalInformation;
