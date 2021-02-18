import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import user from '../../assets/images/profile-img.png';
import { vw, vh, vmax, vmin } from 'react-native-expo-viewport-units';
import { useSelector, connect } from 'react-redux'
import { API_URL } from '@env'
import axios from 'axios'
import moment from 'moment'

const DetailTranfer = ({ navigation, route }) => {
    const [detail, setDetail] = useState({})
    const toPrice = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const token = useSelector((state) => state.authReducer.token);

    const config = {
        headers: {
            'x-access-token': 'bearer ' + token,
        },
    };

    const getDetails = () => {
        axios.get(API_URL + `/tranfer/details/${route.params.id}`, config)
            .then(({ data }) => {
                setDetail(data.data)
            }).catch(({ response }) => {
                console.log(response.data)
            })
    }

    useEffect(() => {
        getDetails()
    }, [])

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
                            navigation.goBack();
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
                        Transfer Details
          </Text>
                </View>
            </View>
            {
                Object.keys(detail).length != 0 ? (
                    <>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                            <View style={styles.status}>
                                <View style={styles.rounded}>
                                    <Icon name="check" size={40} color="white" />
                                </View>
                                <Text style={styles.textStatus}>Transfer Success</Text>
                            </View>
                            <View style={styles.content}>
                                <View style={styles.amountStyle}>
                                    <Text style={styles.title}>Amount</Text>
                                    <Text style={styles.item}>Rp. {toPrice(detail.amount)}</Text>
                                </View>
                                <View style={styles.subContent}>
                                    <View style={styles.content2}>
                                        <Text style={styles.title}>Date</Text>
                                        <Text style={styles.item}>{new Date(moment(detail.created_at.split(' ')[0])).toDateString()}</Text>
                                        {console.log(new Date(moment(detail.created_at.split(' ')[0])).toDateString())}

                                    </View>

                                    <View style={styles.content3}>
                                        <Text style={styles.title}>Time</Text>
                                        <Text style={styles.item}>{detail.created_at.split(' ')[1].split('.')[0]}</Text>
                                    </View>
                                </View>

                                <View style={styles.subList}>
                                    <Text style={styles.title}>Notes</Text>
                                    <Text style={styles.item}>{detail.notes}</Text>
                                </View>

                                <Text style={styles.from}>From</Text>

                                <View style={styles.receiver}>
                                    <View style={styles.contact}>
                                        <View>
                                            <Image source={{ uri: API_URL + detail.sender_image }} style={styles.imgUser} />
                                        </View>
                                        <View>
                                            <Text style={styles.name}>{detail.sender}</Text>
                                            <Text style={styles.num}>{detail.sender_phone}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.from}>To</Text>

                                <View style={styles.receiver}>
                                    <View style={styles.contact}>
                                        <View>
                                            <Image source={{ uri: API_URL + detail.receiver_image }} style={styles.imgUser} />
                                        </View>
                                        <View>
                                            <Text style={styles.name}>{detail.receiver}</Text>
                                            <Text style={styles.num}>{detail.receiver_phone}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : (
                        <View style={{ height: vh(72.5) }} />
                    )
            }

            <View style={{ marginBottom: 25 }}>
                <TouchableOpacity
                    style={styles.btnActive}
                >
                    <Text style={styles.textActive} onPress={() => {
                        navigation.navigate('Home')
                    }}>
                        Back to home
          </Text>
                </TouchableOpacity>
            </View>
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
    status: {
        alignSelf: 'center',
        marginTop: 40,
        alignItems: 'center',
    },
    rounded: {
        width: 65,
        height: 65,
        backgroundColor: '#1EC15F',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginBottom: 20,
    },
    textStatus: {
        color: '#4D4B57',
        fontSize: 22,
    },
    content: {
        padding: vw(5),
    },
    title: {
        fontSize: 16,
        color: '#7A7886',
        lineHeight: 22,
        // marginBottom: 10,
    },
    item: {
        color: '#514F5B',
        fontSize: 17,
        fontWeight: 'bold',
        // marginBottom: 18,
    },
    subContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    amountStyle: {
        backgroundColor: 'white',
        height: 70,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    content2: {
        width: '45%',
        backgroundColor: 'white',
        height: 70,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    content3: {
        width: '45%',
        backgroundColor: 'white',
        height: 70,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    subList: {
        marginTop: 20,
        backgroundColor: 'white',
        padding: 10,
        height: 80,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'space-around',
        borderWidth: 0.2,
        borderColor: '#EAECEE',
        elevation: 0.5,
    },
    from: {
        fontSize: 16,
        marginTop: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    receiver: {
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: '#EAECEE',
        elevation: 0.5,
    },
    contact: {
        padding: 13,
        marginTop: 10,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 12,
    },
    imgUser: {
        width: 56,
        height: 56,
        borderRadius: 10,
        marginRight: 18,
    },
    name: {
        color: '#4D4B57',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    num: {
        color: '#7A7886',
        fontSize: 15,
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
    textActive: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
    },
});

export default DetailTranfer;
