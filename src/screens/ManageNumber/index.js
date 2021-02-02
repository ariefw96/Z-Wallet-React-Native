import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ManageNumber = ({navigation}) => {
  return (
   <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6379F4"
        translucent={true}
      />
      <View style={styles.header}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{marginTop: 20}}>
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
            Manage Phone Number
          </Text>
        </View>
      </View>
       <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          You can only delete the phone number and then
        </Text>
        <Text style={styles.title}>
          You must add another Phone number
        </Text>
        <View style={styles.list}>
          <Text style={styles.listTitle}>Primary</Text>
          <Text style={styles.subTitle}>1223333</Text>
          <Text style={styles.manage}>
              <Icon name="trash-can-outline" size={30} />
          </Text>
        </View>
      </View>
    </ScrollView>
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
    // marginBottom: 40,
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
    marginTop: 40,
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
});

export default ManageNumber;
