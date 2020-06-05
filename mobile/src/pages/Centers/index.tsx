import React, { useEffect, useState } from "react";
import Constants from "expo-constants";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import api from "../../services/api";

interface ParamProps {
  uf: string;
  city: string;
}

interface TypesProps {
  id: number;
  title: string;
  image_url: string;
}

interface CenterProps {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

const Centers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routePrams = route.params as ParamProps;

  const [types, setTypes] = useState<TypesProps[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [centers, setCenters] = useState<CenterProps[]>([]);

  useEffect(() => {
    api.get("types").then((response) => {
      setTypes(response.data);
    });
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          ":(",
          "Precisamos que autorize a localização para exibir o mapa"
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    console.log(routePrams);
    api
      .get("centers", {
        params: {
          city: routePrams.city,
          uf: routePrams.uf,
          items: selectedTypes,
        },
      })
      .then((response) => {
        setCenters(response.data);
      });
  }, [selectedTypes]);

  function handleGoToHome() {
    navigation.goBack();
  }

  function handleGoToDetail(id: number) {
    navigation.navigate("Detail", { id });
  }

  function handleItemPress(id: number) {
    const selected = selectedTypes.findIndex((item) => item === id);

    if (selected >= 0) {
      const filtered = selectedTypes.filter((item) => item !== id);
      setSelectedTypes(filtered);
    } else {
      setSelectedTypes([...selectedTypes, id]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoToHome}>
          <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              loadingEnabled={initialPosition[0] === 0}
            >
              {centers.map((center) => (
                <Marker
                  key={String(center.id)}
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: center.latitude,
                    longitude: center.longitude,
                  }}
                  onPress={() => handleGoToDetail(center.id)}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: center.image_url,
                      }}
                    ></Image>
                    <Text style={styles.mapMarkerTitle}>{center.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {types.map((type) => (
            <TouchableOpacity
              key={String(type.id)}
              style={[
                styles.item,
                selectedTypes.includes(type.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleItemPress(type.id)}
              activeOpacity={0.5}
            >
              <SvgUri width={42} height={42} uri={type.image_url}></SvgUri>
              <Text style={styles.itemTitle}>{type.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: "Ubuntu_700Bold",
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
    fontFamily: "Roboto_400Regular",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: "#34CB79",
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: "Roboto_400Regular",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#eee",
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    textAlign: "center",
    fontSize: 13,
  },
});

export default Centers;
