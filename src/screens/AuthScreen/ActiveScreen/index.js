import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconUser from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux'
import {API_URL} from '@env';

const ActiveScreen = ({navigation}) => {
  const emailRedux = useSelector((state) => state.authReducer.email);
  const [email, setEmail] = useState(emailRedux);
  const [otp, setOtp] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const empty = () => {
    if (email === '' || otp === '') {
      return true;
    } else {
      return false;
    }
  };
  const activate = () => {
    if (!empty()) {
      if (email === '' || otp === '') {
        setErrMsg('filed email or otp');
      } else {
        axios
          .get(API_URL + `/auth/activate/${email}/${otp}`)
          .then((res) => {
            console.log('email aktive', res);
            navigation.navigate('Login');
          })
          .catch((err) => {
            console.log(err.response.data);
            console.log('error disokin', err);
          });
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.name}>Zwallet</Text>
      <View style={styles.content}>
        <View style={styles.subContent}>
          <Text style={styles.header}>Active Your account</Text>
          <Text style={styles.subHeader}>
            Active to your existing account to access
          </Text>
          <Text style={styles.subHeader}>all the features in Zwallet</Text>
        </View>
        <View style={styles.form}>
          <Input
            placeholder="Enter your e-mail"
            keyboardAppearance="dark"
            leftIcon={
              <Icon
                name="email-outline"
                size={24}
                color={email === '' ? '#878787' : '#6379F4'}
              />
            }
            onChangeText={(email) => setEmail(email)}
          />
          <Input
            placeholder="Enter your OTP"
            leftIcon={
              <IconUser
                name="user"
                size={24}
                color={otp === '' ? '#878787' : '#6379F4'}
              />
            }
            onChangeText={(otp) => setOtp(otp)}
          />
        </View>

        <TouchableOpacity
          style={empty() ? styles.btn : styles.btnActive}
          onPress={() => {
            if (!empty()) {
              activate();
            }
          }}>
          <Text style={empty() ? styles.textNon : styles.textActive}>
            Activate
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  name: {
    // marginBottom: 50,
    color: '#6379F4',
    alignSelf: 'center',
    marginTop: 150,
    fontSize: 26,
    fontWeight: 'bold',
  },
  content: {
    paddingBottom: 30,
    padding: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 0.5,
    borderColor: '#EEEEEE',
    elevation: 1,
    marginTop: 135,
    // height: '100%',
  },
  subContent: {
    marginTop: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subHeader: {
    fontSize: 16,
    color: '#878787',
  },
  form: {
    marginTop: 10,
  },
  forgot: {
    alignSelf: 'flex-end',
    paddingRight: 15,
    top: -8,
  },
  btn: {
    width: '90%',
    backgroundColor: '#DADADA',
    padding: 18,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25,
    borderRadius: 12,
  },
  btnActive: {
    width: '90%',
    backgroundColor: '#6379F4',
    padding: 18,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25,
    borderRadius: 12,
  },
  textNon: {
    fontWeight: 'bold',
    color: '#88888F',
    fontSize: 20,
  },
  textActive: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
  acc: {
    alignSelf: 'center',
    marginTop: 20,
    color: '#5D5757',
  },
  login: {
    color: '#6379F4',
    fontWeight: 'bold',
  },
});

export default ActiveScreen;
