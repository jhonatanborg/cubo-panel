<template>
  <div>
    <Menu />

    <v-content>
      <v-container class="col-sm-12">
        <v-card class flat outlined>
          <v-card-title color="red">
            Usuários
            <v-spacer></v-spacer>
            <div class="d-flex justify-space-between">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                solo
                dense
                class="mr-2"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click.stop="userInsert  = true">Novo Usuário</v-btn>
            </div>
          </v-card-title>
          <v-data-table
            fixed-header
            locale="pt"
            :headers="headers"
            :items="BoxList"
            :items-per-page="5"
            :search="search"
            class="elevation-0"
          >
            <template v-slot:item.openDate="{ item }">
              <div small v-text="convertDate(item.openDate)" dark></div>
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip small :color="getColor(item.status)" dark>{{ item.status}}</v-chip>
            </template>
            <template v-slot:item.userInfo[0].name="{ item }">
              <div small v-text="clientNameUpper(item.userInfo[0].name)" dark></div>
            </template>
            <template v-slot:item.acao="{ item }">
              <v-icon small class="mr-2" @click="viewBox(item)">mdi-eye</v-icon>
            </template>
          </v-data-table>
        </v-card>
        <v-row justify="center">
          <v-dialog
            v-model="detailsBox"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar dense flat dark color="primary">
                <v-btn icon dark @click="detailsBox = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Caixa 01210</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-divider></v-divider>
              <div class="col-sm-12">
                <v-layout class="d-flex justify-space-between">
                  <v-flex xs12 sm6 md3 class="mr-3">
                    <v-alert icon="mdi-firework" border="left" color="indigo" dark>
                      <div>
                        Plano
                        <b></b>
                      </div>
                      <v-divider></v-divider>
                      <div>
                        em
                        <b></b> vezes
                      </div>
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm6 md3 class="mr-3">
                    <v-alert icon="mdi-firework" border="left" color="indigo" dark>
                      <div>Entradas</div>
                      <v-divider></v-divider>
                      <div>
                        <b>R$ 500,00</b>
                      </div>
                    </v-alert>
                  </v-flex>

                  <v-flex xs12 sm6 md3 class="mr-3">
                    <v-alert icon="mdi-clipboard-alert-outline" border="left" color="indigo" dark>
                      <div>Saídas</div>
                      <v-divider></v-divider>
                      <div>
                        <b>R$ 50,00</b>
                      </div>
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm6 md3 class="mr-3 pb-1">
                    <v-alert icon="mdi-clipboard-check-outline" border="left" color="indigo" dark>
                      <div>Suprimento incial</div>
                      <v-divider></v-divider>
                      <div>
                        <b>150,00</b>
                      </div>
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-alert border="left" color="success" dark>
                      <v-row align="center" no-gutters>
                        <div>Usuario</div>
                        <v-divider></v-divider>
                        <div>
                          <b>Jhonatan Borges</b>
                        </div>
                      </v-row>
                    </v-alert>
                  </v-flex>
                </v-layout>
              </div>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Menu from '../components/Menu';
import vars from '../plugins/env.local'
const url = `${vars.host}boxController.php`
export default {
  components: {
    Menu,
  },
  mounted: function () {
    this.getBoxDay()
  },
  data: () => ({
    search: '',
    detailsBox: false,
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
    boxId: 20,
    BoxList: [],
    headers: [
      { text: 'ID', value: 'boxId' },
      {
        text: 'Data',
        align: 'left',
        sortable: true,
        value: 'openDate',
      },
      { text: 'Usuário', value: 'userInfo[0].name' },
      { text: 'Status', value: 'status' },
      { text: 'Ações', value: 'acao', sortable: false },

    ],
    BoxList: [],
  }),
  methods: {
    convertDate(date) {
      var parts = date.split(' ')[0].split('-')
      var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydate.toLocaleDateString()
    },
    clientNameUpper(name) {
      let clientName = name.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')
      return clientName
    },
    getBoxDay(date = this.date) {
      let form = new FormData()
      form.append('get-box-day', 'true')
      form.append('date', this.date)
      fetch(url, {
        method: "POST",
        body: form
      }).then(resp => {
        return resp.json()
      }).then(json => {
        // let json = JSON.parse(obj)
        console.log(json[0].openDate.split(' ')[0])
        this.BoxList = json
        // alert(json.msg)
        // document.getElementById('resp').innerHTML = json
      })
    },
    day(dialog) {
      console.log(this.date)
      this.getBoxDay(this.date)
      this.modal = false
      dialog.save(this.date)
    },
    getColor(status) {
      if (status == "ABERTO") return 'primary'
      else if (status == "FECHADO") return 'orange'
      else if (status == "VENCIDA") return 'red'
      else if (status == "RECEBIDA") return 'primary'
      else if (status == "PENDENTE") return 'amber'
      else if (status == "COBRADO") return 'purple darken-3'
      else if (status == "CANCELADO") return 'red'
      else return 'green'
    },
    viewBox(item) {
      console.log(item);
      this.detailsBox = true
      let formData = new FormData()
      formData.append('box-details', 'true')
      formData.append('box-id', item.boxId)
      fetch(url, {
        method: 'POST',
        body: formData
      }).then(resp => {
        return resp.json()
      }).then(json => {
        this.boxDetails = json
        // document.getElementById('resp').innerHTML = json
        console.log(json)
        this.receivedsBox = json.installments
      })
    },
  }
}
</script>

<style>
</style>