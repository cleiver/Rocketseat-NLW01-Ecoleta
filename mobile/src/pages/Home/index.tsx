import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, ImageBackground } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import api from "../../services/api";

interface UFProps {
  uf: string;
}

interface PickerSelectProps {
  label: string;
  value: string;
}

interface CityProps {
  city: string;
}

const Home = () => {
  const emptyCity = [
    { label: "Selecine um Estado para exibir as cidades", value: "" },
  ];

  const [ufList, setUfList] = useState<PickerSelectProps[]>([]);
  const [cityList, setCityList] = useState<PickerSelectProps[]>(emptyCity);
  const [selectedUF, setSelectedUF] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();

  const navigation = useNavigation();

  useEffect(() => {
    api.get<UFProps[]>("uf").then((response) => {
      const ufs = response.data.map((item) => {
        return {
          label: item.uf,
          value: item.uf,
        };
      });
      setUfList(ufs);
    });
  }, []);

  function handleUfSelect(uf: string) {
    setCityList(emptyCity);

    if (uf) {
      api.get<CityProps[]>(`uf/${uf}`).then((response) => {
        const cities = response.data.map((item) => {
          return {
            label: item.city,
            value: item.city,
          };
        });

        setSelectedUF(uf);
        setCityList(cities);
      });
    }
  }

  function handleCitySelect(city: string) {
    setSelectedCity(city);
  }

  function handleGoToCentersPage() {
    if (selectedCity && selectedUF) {
      navigation.navigate("Centers", {
        uf: selectedUF,
        city: selectedCity,
      });
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      imageStyle={{ width: 274, height: 368 }}
      style={styles.container}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>

      <RNPickerSelect
        placeholder={{ label: "Selecione aqui um Estado", value: "" }}
        items={ufList}
        onValueChange={(value) => handleUfSelect(value)}
      />

      <RNPickerSelect
        placeholder={{ label: "Selecione aqui uma cidade", value: "" }}
        items={cityList}
        onValueChange={(value) => handleCitySelect(value)}
      />

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleGoToCentersPage}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24}></Icon>
            </Text>
          </View>
          <Text style={styles.buttonText}>Ver centros de coleta</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
