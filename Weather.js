import React, {useState, useEffect} from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';


export default function Weather() {

    const apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=43.65&lon=-79.34&appid=4bafd526282d774b01de6b6c26c40263&units=metric&exclude=minutely,hourly'
    const [weatherData, setWeatherData] = useState({})
    const [lat, setLat] = useState()
    const [long, setLong] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false)

    const Row = ({data}) => {
        const iconUrl = `https://openweathermap.org/img/wn/04d@2x.png`
        return (
            <View style={styles.row}>
                <Image style={{width: 100, height:100}} source={{uri: iconUrl}}/>
                <Text>{data.temp.day}</Text>
                
            </View>
        )
    }

    const renderRow = ({item}) => <Row data={item}/>
    
    

    useEffect(() => {

        fetch(apiUrl)
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
    }, [])
    

    return (
        <SafeAreaView>
        {isLoading ?
            <View>
                <ActivityIndicator size='large' color='#00ff00'/>
                <Text>Loading albums, please wait...</Text>
            </View>
            :
            <View>
                <FlatList
                data={weatherData.daily}
                keyExtractor={item=>item.dt}
                renderItem={renderRow}>
                </FlatList>
            </View>
        }
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    row: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 10,
      marginLeft: 20,
      marginRight: 10,
      padding: 10,
      backgroundColor: '#bcf5bc',
      borderColor: '#0000FF',
      borderWidth: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
  });
