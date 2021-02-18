import React, { useEffect, useState, createRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ActionSheet from 'react-native-actions-sheet';

import { API_URL } from '@env';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';
import { useSelector, connect } from 'react-redux';
import CalendarPicker from 'react-native-calendar-picker'
import moment from 'moment'
import axios from 'axios';

// ariefwidiyatmoko38@gmail.com
// Gaspoll19

const HistoryScreen = ({ navigation, route }) => {
  const actionSheetRef = createRef();

  const [historyWeek, setHistoryWeek] = useState([]);
  const [historyMonth, setHistoryMonth] = useState([]);
  const [selectedStartDate, setStartDate] = useState('')
  const [selectedEndDate, setEndDate] = useState('')
  const [tranferType, setType] = useState('')
  const [isFilterDate, setFiterDate] = useState(false)
  const [selectedIn, setSelectedIn] = useState(false)
  const [selectedOut, setSelectedOut] = useState(false)
  const toPrice = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setSelectedOut(false)
    setSelectedIn(false)
    setRefreshing(true);
    getDataWeek();
    getDataMonth();
    setFiterDate(false)

    wait(2000).then(() => setRefreshing(false));
  }, []);


  const token = useSelector((state) => state.authReducer.token);

  const getDataWeek = () => {
    axios
      .get(`${API_URL}/home/getAllInvoice?thisWeek=true`, {
        headers: {
          'x-access-token': 'bearer ' + token,
        },
      })
      .then(({ data }) => {
        // console.log('Datanya Week', data.data);
        setHistoryWeek(data.data);
      })
      .catch((err) => console.log(err));
  };

  const getDataMonth = () => {
    axios
      .get(`${API_URL}/home/getAllInvoice?thisMonth=true`, {
        headers: {
          'x-access-token': 'bearer ' + token,
        },
      })
      .then(({ data }) => {
        // console.log('Datanya Month', data.data);
        setHistoryMonth(data.data);
      })
      .catch((err) => console.log(err));
  };

  const getDataWeekIn = (flow) => {
    axios
      .get(`${API_URL}/home/getInvoice?thisWeek=true&flow=${flow}`, {
        headers: {
          'x-access-token': 'bearer ' + token,
        },
      })
      .then(({ data }) => {
        // console.log('Datanya WeekIN', data.data);
        setHistoryWeek(data.data);
      })
      .catch((err) => console.log(err));
  };

  const getDataMonthIn = (flow) => {
    axios
      .get(`${API_URL}/home/getInvoice?thisMonth=true&flow=${flow}`, {
        headers: {
          'x-access-token': 'bearer ' + token,
        },
      })
      .then((res) => {
        const monthIn = res.data.data;
        // console.log('Datanya MonthIN', monthIn);
        setHistoryMonth(monthIn);
      })
      .catch((err) => console.log(err));
  };

  const getDataIn = () => {
    setSelectedOut(false)
    getDataWeekIn('in');
    getDataMonthIn('in');
    setType('- Incoming Tranfer')
    setSelectedIn(true)
    setFiterDate(false)
  };

  const getDataOut = () => {
    setSelectedIn(false)
    getDataWeekIn('out');
    getDataMonthIn('out');
    setType('- Outgoing Tranfer')
    setSelectedOut(true)
    setFiterDate(false)
  }
  // GetDataWeek
  useEffect(() => {
    getDataWeek();
    getDataMonth();
  }, [token]);

  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setEndDate(date)
    } else {
      setStartDate(date),
        setEndDate(null)
    }
  }

  const getDataRange = () => {
    setSelectedOut(false)
    setSelectedIn(false)
    const startDate = moment(selectedStartDate).format('YYYY-MM-DD')
    const endDate = moment(selectedEndDate).format('YYYY-MM-DD')
    axios.get(API_URL + `/home/getAllInvoice?from=${startDate}&to=${endDate}`, {
      headers: {
        'x-access-token': 'bearer ' + token,
      }
    })
      .then(({ data }) => {
        setHistoryWeek([])
        setHistoryMonth(data.data)
        setType('')
        setFiterDate(true)
      }).catch(({ response }) => {
        console.log(response.data)
      })
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}></View>

      {/*  Week */}
      <View style={styles.container}>
        <ScrollView showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <View>
              <View style={styles.transactionHeader}>
                <Text
                  style={{ color: '#514F5B', fontSize: 18, fontWeight: '700' }}>
                  {isFilterDate ? (
                    <>
                    </>
                  ) : (
                      <>
                        This Week {tranferType}
                      </>
                    )}
                </Text>
              </View>
              {/* Card transaction */}
              {historyWeek.length > 0
                ? historyWeek.map((data) => (
                  <View style={styles.cardTransaction} key={data.id}>
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
                  </View>
                ))
                : (<Text style={{ textAlign: 'center' }}>There are no tranfer this week.</Text>)}
            </View>

            <View>
              <View style={styles.transactionHeader}>
                <Text
                  style={{ color: '#514F5B', fontSize: 18, fontWeight: '700' }}>
                  {isFilterDate ? (
                    <>
                      History from {new Date(selectedStartDate).toDateString()} to {new Date(selectedEndDate).toDateString()}
                    </>
                  ) : (
                      <>This Month</>
                    )}
                </Text>
              </View>
              {/* Card transaction */}
              {historyMonth.length > 0
                ? historyMonth.map((data) => (
                  <View style={styles.cardTransaction} key={data.id}>
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
                  </View>
                ))
                : (<Text style={{ textAlign: 'center' }}>There are no tranfer this month.</Text>)}
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomSortings}>
        <View style={selectedOut ? { ...styles.btnUpDown, borderWidth: 1, borderColor: 'red' } : styles.btnUpDown}>
          <TouchableOpacity onPress={getDataOut}>
            <Icon name="arrowup" color="#FF5B37" size={30} />
          </TouchableOpacity>
        </View>
        <View style={selectedIn ? { ...styles.btnUpDown, borderWidth: 1, borderColor: 'red' } : styles.btnUpDown}>
          <TouchableOpacity onPress={getDataIn}>
            <Icon name="arrowdown" color="#6379F4" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.btnDaterange}>
          <TouchableOpacity
            // onPress={() => setVisible(true)}>
            onPress={() => actionSheetRef.current?.setModalVisible()}>
            <Text style={{ color: '#6379F4', fontSize: 20, fontWeight: 'bold' }}>
              Filter By Date
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Sheet */}
      <ActionSheet ref={actionSheetRef}>
        <View style={{ paddingBottom: 20 }}>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            todayBackgroundColor="#f2e6ff"
            selectedDayColor="#7300e6"
            selectedDayTextColor="#FFFFFF"
            onDateChange={onDateChange}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: vw(8), marginTop: 5, borderTopWidth: 0.5, borderColor: 'gray' }}>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: 'gray', width: vw(30), paddingVertical: 10, borderRadius: 15, backgroundColor: '#d9534f', marginTop: 5 }}
              onPress={() => actionSheetRef.current?.hide()}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                DISCARD
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: 'gray', width: vw(30), paddingVertical: 10, borderRadius: 15, backgroundColor: '#428bca', marginTop: 5 }}
              onPress={getDataRange}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                APPLY
            </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
    </>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 30,
    backgroundColor: '#6379F4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
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
  profileImage: {
    width: 52,
    height: 52,
  },
  profileWrapper: {
    flexDirection: 'row',
    marginTop: 69,
  },
  bottomSortings: {
    bottom: 0,
    backgroundColor: 'transparent',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  btnUpDown: {
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '20%',
    margin: 2,
  },
  btnDaterange: {
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '60%',
    margin: 2,
  },
});
