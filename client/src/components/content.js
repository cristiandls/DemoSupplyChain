import React, { Component } from 'react';
import DemoSupplyChain from '../contracts/DemoSupplyChain.json';
import getWeb3 from '../utils/getWeb3';
import truffleContract from "truffle-contract";
import TableReadings from './readings';
import { Input, Button, Icon, Row, Col, CardPanel } from 'react-materialize'

class Content extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      readings: [],
      devices: [],
      sensor: null,
      device: '1',
      readingCount: 8,
    };

    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChangeReading = this.handleChangeReading.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeSelect(event) {
    this.setState({ device: event.target.value });
  }

  handleChangeReading(event) {
    this.setState({ readingCount: event.target.value });
  }


  handleSubmit(event) {
    this.getContractInfo();
    event.preventDefault();
  }

  componentDidMount = async () => {

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(DemoSupplyChain);
      Contract.setProvider(web3.currentProvider);

      const instance = await Contract.deployed();

      //Obtener dispositivos
      const devices = await instance.getAllDevices();
      const deviceItems = [];

      //Recorrer los dispositivos encontrados
      for (let i = 0; i < devices[0].length; i++) {
        const id = devices[0][i].toString();
        // const descripcion = web3.utils.toAscii(devices[1][i]);
        const descripcion = web3.utils.toUtf8(devices[1][i]);
        let deviceItem = {
          id: id,
          descripcion: descripcion,
        }
        deviceItems.push(deviceItem);
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, devices: deviceItems });

      //Setear timer cada 10 segundos
      this.interval = setInterval(() => this.getContractInfo(), 10000);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  getContractInfo = async () => {
    const { contract, device, readingCount } = this.state;

    //Obtener lecturas
    const readings = await contract.getLastNReadingsByDeviceId(device, readingCount);
    const readingItems = [];

    let id = 0;

    //Recorrer las lecturas obtenidos del dispositivo
    for (let i = 0; i < readings[0].length; i++) {
      id += 1
      const sender = readings[0][i].toString();
      const fechahora = new Date(Number(readings[1][i].toString()));
      const fecha = fechahora.getDate() + '/' + (fechahora.getMonth() + 1) + '/' + fechahora.getFullYear();
      const hora = fechahora.getHours() + ':' + fechahora.getMinutes();
      const temperatura = readings[2][i].toString() + '°C';
      let readingItem = {
        id: id,
        sender: sender,
        fecha: fecha,
        hora: hora,
        temperatura: temperatura
      }
      readingItems.push(readingItem);
    }
    this.setState({ readings: readingItems });
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    const { readings, devices } = this.state;

    return (
      <div className="Content">
        <Row>
          <Col s={12} m={12}>
            <CardPanel className="#f9fbe7 lime lighten-5">
              <Row>
                <form onSubmit={this.handleSubmit}>
                  <Input s={4} type='select' label="Lista de dispositivos/sensores" onChange={this.handleChangeSelect} value={this.state.device}>
                    {devices.map(n => {
                      return (
                        <option key={n.id} value={n.id}>{n.descripcion}</option>
                      );
                    })}
                  </Input>
                  <Input type="text" s={4} label="Cantidad de lecturas a obtener de la Blockchain" onChange={this.handleChangeReading} defaultValue="8" />
                  <div>
                    <Button type="submit" s={4} className="#1565c0 blue darken-3" waves='light'>Obtener lecturas<Icon left>refresh</Icon></Button>
                  </div>
                </form>
              </Row>
              <Row>
                <TableReadings readings={readings} />
              </Row>
            </CardPanel>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Content;