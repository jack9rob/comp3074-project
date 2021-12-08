import React, {useState, useEffect} from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as Location from 'expo-location'





export default function Weather() {

    const [weatherData, setWeatherData] = useState({})
    const [location, setLocation] = useState({lat: null, long:null})
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false)
    const [isReady, setIsReady] = useState(false)
    
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const Row = ({data}) => {
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        let date = new Date(data.dt * 1000)
        let today = new Date();
        let date_name = `${days[date.getDay()]} ${date.getDate()}`
        if(today.getDate() === date.getDate()) {
            date_name = 'Today'
        }
        return (
            <View style={styles.container}>

                <View style={styles.row}>
                    <Image style={{width: 100, height:100}} source={{uri: iconUrl}}/>
                    <View style={styles.day}>
                        <Text style={{padding: 20, fontSize: 20}}>{date_name}</Text>
                        <Text style={{padding: 20, fontSize: 30, fontWeight: 'bold'}}>{Math.round(data.temp.day)}&#176;C</Text>
                        <Text style={{padding: 20, fontSize: 20}}>{data.weather[0].description}</Text>
                        <Text>feels like: {Math.round(data.feels_like.day)}&#176;C</Text>
                    </View>
                    
                    <View>
                        <Text>High: {Math.round(data.temp.max)}&#176;C</Text>
                        <Text>Low: {Math.round(data.temp.min)}&#176;C</Text>
                        <Text>Humidity: {data.humidity}%</Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderRow = ({item}) => <Row data={item}/>
    
    const geoSuccess = (position) => {
        setIsReady(true)
        console.log(position)
        let tempLocation = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }
        setLocation(tempLocation)
        
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${tempLocation.lat}&lon=${tempLocation.long}&appid=4bafd526282d774b01de6b6c26c40263&units=metric&exclude=minutely,hourly`)
        .then((response) => response.json())
        .then((json) => {
            setWeatherData(json)
            setIsLoading(false)
            setIsError(false)
        }).catch((error) => {
            setIsError(true)
            setIsLoading(false)
            setWeatherData([])
            console.log(error)
        })
    }
    

    const geoFailure = (err) => {
        setIsError(true)
        setIsLoading(false)
        setIsReady(false)
        console.log(err.message)
    }

    useEffect(() => {
        setIsError(false)
        setIsLoading(true)
        setIsReady(false)

        let geoOptions = {
            enableHighAccuracy: true,
            timeOut: 20000,
            maximumAge: 60 * 60
        }
        Location.installWebGeolocationPolyfill()
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure, geoOptions)
    }, [])
    

    return (
        <SafeAreaView>
            {isLoading ?
                <View>
                    <ActivityIndicator size='large' color='#00ff00'/>
                    <Text>Loading data, please wait...</Text>
                </View>
                :
                isReady ?
                    <View>
                        <Text>{weatherData.timezone.split('/')[1]}</Text>
                        <Text>{`Latitude: ${location.lat} Longitude: ${location.long}`}</Text>
                        <FlatList
                        data={weatherData.daily}
                        keyExtractor={item=>item.dt}
                        renderItem={renderRow}>
                        </FlatList>
                    </View>
                    :
                    <View>
                        <Text>can't get location</Text>
                    </View>
                
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 10,
        padding: 10,
        backgroundColor: '#bcf5bc',
        borderColor: '#0000FF',
        borderWidth: 1,
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',

    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    day: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: 20
    }
  });
