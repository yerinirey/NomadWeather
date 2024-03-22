import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  useFonts,
  BlackHanSans_400Regular,
} from "@expo-google-fonts/black-han-sans";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "a2ae601046c8037bec386a098368fccc";

const icons = {
  Clouds: "cloud",
  Clear: "white-balance-sunny",
  Rain: "weather-rainy",
  Snow: "snowflake",
  Drizzle: "weather-rainy",
  Thunderstrom: "weather-lightning",
  Atmosphere: "weather-windy",
};

export default function App() {
  let [fontsLoaded] = useFonts({
    BlackHanSans_400Regular,
  });
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) setOk(false);
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    console.log(location);
    setCity(location[0].city);
    const { list } = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
      )
    ).json();
    const filteredList = list.filter(({ dt_txt }) =>
      dt_txt.endsWith("12:00:00")
    );
    setDays(filteredList);
  };

  useEffect(() => {
    getWeather();
  }, []);
  if (!fontsLoaded) return null;
  else
    return (
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.weather}
        >
          {days.length === 0 ? (
            // 로딩
            <View style={{ ...styles.day, alignItems: "center" }}>
              <ActivityIndicator
                color="white"
                size="large"
                style={{ marginTop: 10 }}
              />
            </View>
          ) : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      ...styles.smalltext,
                      marginBottom: 10,
                    }}
                  >
                    {new Date(day.dt * 1000).toString().substring(0, 10)}
                  </Text>
                </View>
                <View
                  style={{
                    borderWidth: 2,
                    width: "100%",
                  }}
                ></View>

                <View
                  style={{
                    flex: 8,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-end",
                      width: "100%",
                      position: "relative",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text // 기온
                      style={styles.temp}
                    >
                      {parseFloat(day.main.temp).toFixed(1)}
                    </Text>
                    <MaterialCommunityIcons // 아이콘
                      name={icons[day.weather[0].main]}
                      size={170}
                      style={styles.icon}
                    />
                  </View>

                  <Text // 영어Description
                    style={styles.description}
                  >
                    {day.weather[0].main}
                  </Text>
                  <Text // 한글Description
                    style={{
                      ...styles.description,
                      fontSize: 50,
                      fontWeight: "500",
                    }}
                  >
                    {day.weather[0].description}
                  </Text>
                </View>
                <View style={{ borderWidth: 2, width: "100%" }}></View>
                <View
                  style={{
                    flex: 2,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <View>
                    <Text style={styles.smalltext}>
                      풍속 {day.wind.speed}m/s
                    </Text>
                    <Text style={styles.smalltext}>
                      습도 {day.main.humidity}%
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.smalltext}>
                      체감 {parseFloat(day.main.feels_like).toFixed(1)}°C
                    </Text>
                    <Text style={styles.smalltext}>
                      최고 {parseFloat(day.main.temp_max).toFixed(1)}°C
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "teal" },
  city: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    fontFamily: "BlackHanSans_400Regular",
  },
  weather: {},
  day: {
    alignItems: "flex-start",
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },
  smalltext: {
    fontSize: 24,
    fontFamily: "BlackHanSans_400Regular",
  },
  temp: {
    marginTop: 50,
    fontSize: 148,
    fontWeight: "600",
    zIndex: 1,
    fontFamily: "BlackHanSans_400Regular",
  },
  description: {
    fontSize: 32,
    fontWeight: "100",
    fontFamily: "BlackHanSans_400Regular",
  },
  icon: {
    color: "white",
    position: "absolute",
    left: "40%",
    bottom: "14%",
  },
});
