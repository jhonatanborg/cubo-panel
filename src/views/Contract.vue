<template>
  <div>
    <Menu />
    <v-content white fluid>
      <div>
        <v-layout class="col-sm-12 d-flex justify-space-between">
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Contrato</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Contrato</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Contrato</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4" outlined>
              <div class="overline mb-2">Contrato</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
        </v-layout>

        <div class="col-sm-12">
          <v-card class flat>
            <v-card-title color="red">
              Contratos
              <v-spacer></v-spacer>
              <div class="d-flex justify-space-between">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar cliente"
                  single-line
                  hide-details
                  solo
                  dense
                  class="mr-2"
                ></v-text-field>
                <v-spacer></v-spacer>
              </div>
            </v-card-title>
            <v-data-table
              locale="pt"
              :headers="headers"
              :items="listContracts"
              :items-per-page="5"
              :search="search"
              class="elevation-0"
            >
              <template v-slot:item.status="{ item }">
                <v-chip small :color="getColor(item.status)" dark>{{ item.status}}</v-chip>
              </template>
              <template v-slot:item.acao="{ item }">
                <v-icon small class="mr-2" @click="viewContract(item)">mdi-eye</v-icon>
                <v-icon small>mdi-trash-can</v-icon>
              </template>
            </v-data-table>
          </v-card>
          <v-dialog
            v-model="contractView"
            fullscreen
            max-width="600px"
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar dense dark color="primary">
                <v-toolbar-title>Cliente</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <div class="container pa-3">
                <div>
                  <div class="mt-5 pb-5">
                    <div class="d-flex justify-space-between">
                      <div>Resumo</div>
                      <v-spacer></v-spacer>
                      <div>Ultima atualização - 24/30/2019 00:30</div>
                    </div>
                    <v-divider dense></v-divider>
                  </div>
                  <v-layout class="d-flex justify-space-between">
                    <v-flex xs12 sm6 md3 class="mr-3">
                      <v-alert
                        icon="mdi-firework"
                        border="left"
                        color="indigo"
                        dark
                      > 10 Parcelas pendentes</v-alert>
                    </v-flex>

                    <v-flex xs12 sm6 md3 class="mr-3">
                      <v-alert
                        icon="mdi-clipboard-alert-outline"
                        border="left"
                        color="indigo"
                        dark
                      >122 Parcelas Vencidas</v-alert>
                    </v-flex>
                    <v-flex xs12 sm6 md3 class="mr-3 pb-1">
                      <v-alert
                        icon="mdi-clipboard-check-outline"
                        border="left"
                        color="indigo"
                        dark
                      > 22 Parcelas Recebidas </v-alert>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-alert border="left" color="success" dark>
                        <v-row align="center" no-gutters>
                          <div>
                            <h5>Status:</h5>
                           {{parcelDetails.status}}
                          </div>
                          <v-spacer></v-spacer>
                          <v-btn
                            x-small
                            class="ma-2"
                            outlined
                            fab
                            color="white"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </v-row>
                      </v-alert>
                    </v-flex>
                  </v-layout>
                </div>
              </div>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </v-content>
  </div>
</template>

<script>
import vars from '../plugins/env.local'
import Menu from '../components/Menu';
const url = `${vars.host}contractController.php`

export default {
  components: {
    Menu,
  },
  mounted: function () {
    this.getContractsDay()
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,
    menu2: false,
    boxId: 20,
    search: '',
    contractView: '',
    parcelDetails: [""],
    listContracts: [],
    headers: [
      { text: 'ID', value: 'id' },

      {
        text: 'Cliente',
        align: 'left',
        sortable: true,
        value: 'client.name',
      },
      { text: 'Telefone', value: 'client.tel' },
      { text: 'Status', value: 'status' },
      { text: 'Ações', value: 'acao', sortable: false },

    ],
  }),
  methods: {
    getContractsDay(date = this.date) {
      let form = new FormData()
      form.append('get-contracts', 'true')
      form.append('date', date)
      fetch(url, {
        method: "POST",
        body: form
      }).then(resp => {
        return resp.json()
      }).then(json => {
        let contracts = []
        json.forEach(contract => {
          contracts.push(contract)
        })
        this.listContracts = contracts
        console.log(this.listContracts)
        // document.getElementById('resp').innerHTML = json
      })
    },
    getColor(status) {
      if (status == "ABERTO") return 'primary'
      else if (status == "FECHADO") return 'orange'
      else return 'green'
    },
    viewContract(item) {
      let form = new FormData()
      form.append('get-contract', 'true')
      form.append('contract-id', item.id)
      fetch(url, {
        method: "POST",
        body: form
      }).then(resp => {
        return resp.json()
      }).then(json => {
        this.parcelDetails = json[0]
        console.log(this.parcelDetails);
        this.contractView = true
      })
    }
  }
}
</script>

<style>
</style>    