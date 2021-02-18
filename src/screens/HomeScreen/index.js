import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, connect } from 'react-redux';
import { setDataUser } from '../../utils/redux/action/myDataAction';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';
import { API_URL } from "@env";
import { useSocket } from './../../utils/context/SocketProvider'
import PushNotification from 'react-native-push-notification';
import { showNotification } from '../../notification';


import profileImg from '../../assets/images/profile-img.png';
import spotifyImg from '../../assets/images/spotify.png';

const HomeScreen = ({ navigation, setDataUser }) => {
  const [user, setUser] = useState();
  const [history, setHistory] = useState();
  const socket = useSocket()

  const toPrice = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const token = useSelector((state) => state.authReducer.token);

  // 192.168.8.100 bisa diganti sama IP laptop kalian/ pake backend deploy
  const url = API_URL;

  const channel = 'notification';
  useEffect(() => {
    PushNotification.createChannel(
      {
        channelId: 'notification',
        channelName: 'My Notification channel',
        channelDescription: 'A channel to categories your notification',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createchannel returned ${created}`),
    );
    // code to run on component mount
  }, []);
  useEffect(() => {
    PushNotification.getChannels((channel_ids) => {
      console.log('CHANNEL', channel_ids[0]);
      () => navigation.navigate('Home');
    });
  }, []);

  const getBalance = () => {
    const config = {
      headers: {
        'x-access-token': 'bearer ' + token,
      },
    };
    axios
      .get(`${url}/home/getBalance`, config)
      .then(({ data }) => {
        // console.log(typeof data.data.balance);
        setUser(data.data);
        setDataUser(data.data);
      })
      .catch((err) => console.log(err));
  }

  const getHistory = () => {
    const config = {
      headers: {
        'x-access-token': 'bearer ' + token,
      },
    };
    axios
      .get(`${url}/home/getAllInvoice`, config)
      .then(({ data }) => {
        setHistory(data.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    if (token != null) {
      getBalance();
      getHistory();
    }
  }, [token]);



  useEffect(() => {
    socket.on('tranferOut', (message) => {
      console.log(message)
      showNotification(
        'Ingfo!',
        message,
        channel,
      )
      getBalance();
      getHistory()
    })
    return () => socket.off('tranferOut')
  }, [socket])

  const refreshData = () => {
    getBalance();
    getHistory()
  }

  useEffect(() => {
    socket.on('tranferIn', (message) => {
      console.log(message)
      showNotification(
        'Ingfo!',
        message,
        channel,
      )
      getBalance();
      getHistory();
    })
    return () => socket.off('tranferIn')
  }, [socket])

  // Cek ketika history transaction kosong maka menampilkan pesan ini
  let emptyHistory;
  history !== undefined && history.length === 0
    ? (emptyHistory = (
      <View
        style={{
          padding: 10,
          alignSelf: 'center',
          marginTop: 100,
        }}>
        <Text style={{ fontSize: 26, color: '#608DE2' }}>Empty?</Text>
        <Text style={{ fontSize: 18 }}>Let's make some transaction.</Text>
      </View>
    ))
    : null;

  return (
    <>
      {token != null ? (
        <ScrollView>
          <StatusBar translucent backgroundColor="transparent" />
          {/* Header profile user, balance info */}
          <View style={styles.header}>
            <View style={styles.profileWrapper}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Profile');
                }}>
                {user !== undefined ? (
                  <Image
                    source={{ uri: API_URL + user.image, width: 52, height: 52 }}
                    style={styles.profileImage}
                  />
                ) : (
                    <Image
                      source={{
                        uri:
                          'http://damuthtaxidermy.com/Content/Staff-Gary-Damuth.png',
                        width: 52,
                        height: 52,
                      }}
                      style={styles.profileImage}
                    />
                  )}
              </TouchableOpacity>

              <View style={styles.balanceWrapper}>
                <TouchableOpacity
                  onPress={refreshData}
                >
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '400' }}>
                    {user !== undefined ? user.name : ''}
                  </Text>
                </TouchableOpacity>
                {/* Price will integrated with backend */}
                <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>
                  Rp. {user !== undefined ? toPrice(user.balance) : null}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
              style={{ marginTop: 75, marginRight: vw(5) }}>
              <Icon name="bell-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>

          {/* Button action */}
          <View style={styles.btnWrapper}>
            <View>
              <Button
                title="Transfer"
                icon={<Icon name="plus" size={25} color="#608DE2" />}
                buttonStyle={styles.btn}
                titleStyle={styles.btnText}
                onPress={() => navigation.navigate('Contact')}
              />
            </View>
            <Button
              title="Top Up"
              icon={<Icon name="arrow-up" size={25} color="#608DE2" />}
              buttonStyle={styles.btn}
              titleStyle={styles.btnText}
              onPress={() => navigation.navigate('Topup')}
            />
          </View>

          {/* Transaction history */}
          <View>
            <View style={styles.transactionHeader}>
              <Text style={{ color: '#514F5B', fontSize: 18, fontWeight: '700' }}>
                Transaction History
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={{ color: '#6379F4', fontSize: 14, marginTop: 1 }}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            {/* Card transaction */}
            {history !== undefined
              ? history.map((data) => (
                <TouchableOpacity
                  style={styles.cardTransaction}
                  key={data.id}
                  onPress={() => {
                    navigation.navigate('Details', {
                      id: data.id,
                    });
                  }}>
                  <View style={styles.cardWrapper}>
                    <Image
                      source={{ uri: `${API_URL}${data.image}` }}
                      style={styles.profileImage}
                    />
                    <View style={styles.cardText}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#4D4B57',
                          fontWeight: '700',
                        }}>
                        {data.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#4D4B57',
                          fontWeight: '400',
                          marginTop: 10,
                        }}>
                        {data.notes}
                      </Text>
                    </View>
                  </View>
                  {data.type === 'out' ? (
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#FF5B37',
                        fontWeight: '700',
                        marginTop: 20,
                      }}>
                      -Rp. {toPrice(data.amount)}
                    </Text>
                  ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          color: 'green',
                          fontWeight: '700',
                          marginTop: 20,
                        }}>
                        +Rp. {toPrice(data.amount)}
                      </Text>
                    )}
                </TouchableOpacity>
              ))
              : null}
            {emptyHistory}
          </View>
        </ScrollView>
      ) : (
          navigation.replace('Login')
        )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDataUser: (data) => dispatch(setDataUser(data)),
  };
};
export default connect(null, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 195,
    backgroundColor: '#6379F4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
  profileWrapper: {
    flexDirection: 'row',
    marginTop: 69,
  },
  balanceWrapper: {
    marginLeft: 10,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 15,
  },
  btn: {
    width: vw(45),
    height: 57,
    backgroundColor: '#E5E8ED',
    borderRadius: 10,
  },
  btnText: {
    color: '#514F5B',
    marginLeft: 10,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 15,
  },
  cardTransaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 96,
    backgroundColor: '#fff',
    width: vw(96),
    marginHorizontal: vw(2),
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  cardWrapper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cardText: {
    marginLeft: 10,
    marginTop: 3,
  },
});
