import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";

import "./styles.css";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import Axios from "axios";
import { LeafletMouseEvent } from "leaflet";
import Dropzone from "../../components/Dropzone";

interface RecycleTypeProps {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFProps {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECityProps {
  id: number;
  nome: string;
}

const CreateCenter: React.FC = () => {
  const [recycleTypes, setRecycleTypes] = useState<RecycleTypeProps[]>([]);
  const [ufs, setUFs] = useState<IBGEUFProps[]>([]);
  const [selectedUF, setSelectedUF] = useState("0");
  const [cities, setCities] = useState<IBGECityProps[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [mapInitialPosition, setMapInitialPosition] = useState<
    [number, number]
  >([0, 0]);
  const [mapClickPosition, setMapClickPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const history = useHistory();

  useEffect(() => {
    api.get("/types").then((response) => {
      setRecycleTypes(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get<IBGEUFProps[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    ).then((response) => {
      setUFs(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedUF === "0") {
      return;
    }

    Axios.get<IBGECityProps[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`
    ).then((response) => {
      setCities(response.data);
    });
  }, [selectedUF]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setMapInitialPosition([latitude, longitude]);
    });
  }, []);

  function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUF(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setMapClickPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectType(id: number) {
    const alreadySelected = selectedTypes.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredTypes = selectedTypes.filter((item) => item !== id);

      setSelectedTypes(filteredTypes);
    } else {
      setSelectedTypes([...selectedTypes, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const [latitude, longitude] = mapClickPosition;
    const uf = ufs.find((item) => item.id === Number(selectedUF));
    const city = cities.find((item) => item.id === Number(selectedCity));
    const items = selectedTypes;

    if (!uf || !city || !selectedImage) {
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("city", city.nome);
    data.append("uf", uf.sigla);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));
    data.append("image", selectedImage);

    await api.post("centers", data);

    alert("Ponto de coleta cadastrado! Obrigado!");
    history.push("/");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eColeta" />
        <Link to="/">
          <FiArrowLeft></FiArrowLeft>
          Voltar para a Home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro de ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedImage}></Dropzone>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={[-22.8748356, -43.1090939]}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapClickPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select name="uf" id="uf" onChange={handleSelectUF}>
                <option value="0">Selecione um Estado</option>
                {ufs.map((uf) => (
                  <option key={uf.id} value={uf.id}>
                    {uf.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Citade</label>
              <select name="city" id="city" onChange={handleSelectCity}>
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <h2>Itens de coleta</h2>
          <ul className="items-grid">
            {recycleTypes.map((type) => (
              <li
                key={type.id}
                onClick={() => handleSelectType(type.id)}
                className={selectedTypes.includes(type.id) ? "selected" : ""}
              >
                <img src={type.image_url} alt={type.title} />
                <span>{type.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreateCenter;
