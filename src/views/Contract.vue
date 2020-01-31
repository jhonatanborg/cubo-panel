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
          <v-card class flat outlined>
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
              <template v-slot:item.client.name="{ item }">
                <div small v-text="clientNameUpper(item.client.name)" dark></div>
              </template>

              <template v-slot:item.action="{ item }">
                <v-icon small class="mr-2" @click="viewContract(item)">mdi-eye</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete-circle-outline</v-icon>
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
              <v-toolbar dense flat dark color="primary">
                <v-toolbar-title>Detalhes</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="close()" icon dark>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <div class="container pa-3">
                <div>
                  <div class="mt-5 pb-5">
                    <div class="d-flex justify-space-between">
                      <div>{{parcelDetails.clientName}}</div>
                      <v-spacer></v-spacer>
                      <div>Ultima atualização - 24/30/2019 00:30</div>
                    </div>
                    <v-divider dense></v-divider>
                  </div>
                  <v-layout class="d-flex justify-space-between">
                    <v-flex xs12 sm6 md3 class="mr-3">
                      <v-alert icon="mdi-firework" border="left" color="indigo" dark>
                        <div>
                          Plano
                          <b v-text="convertMoney(parcelDetails.planValue)"></b>
                        </div>
                        <v-divider></v-divider>
                        <div>
                          em
                          <b>{{parcelDetails.qtdParcel}}</b> vezes
                        </div>
                      </v-alert>
                    </v-flex>
                    <v-flex xs12 sm6 md3 class="mr-3">
                      <v-alert icon="mdi-firework" border="left" color="indigo" dark>
                        <div>{{parcelDetails.qtdPending}} pendentes</div>
                        <v-divider></v-divider>
                        <div>
                          <b v-text="convertMoney(parcelDetails.pending)"></b>
                        </div>
                      </v-alert>
                    </v-flex>

                    <v-flex xs12 sm6 md3 class="mr-3">
                      <v-alert icon="mdi-clipboard-alert-outline" border="left" color="indigo" dark>
                        <div>{{parcelDetails.qtdUnsuccessful}} Vencidas</div>
                        <v-divider></v-divider>
                        <div>
                          <b v-text="convertMoney(parcelDetails.unsuccessful)"></b>
                        </div>
                      </v-alert>
                    </v-flex>
                    <v-flex xs12 sm6 md3 class="mr-3 pb-1">
                      <v-alert icon="mdi-clipboard-check-outline" border="left" color="indigo" dark>
                        <div>{{parcelDetails.qtdReceive}} Recebidas</div>
                        <v-divider></v-divider>
                        <div>
                          <b v-text="convertMoney(parcelDetails.receive)"></b>
                        </div>
                      </v-alert>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-alert border="left" color="success" dark>
                        <v-row align="center" no-gutters>
                          <div>
                            <h5>Status:</h5>
                            <b>{{parcelDetails.status}}</b>
                          </div>
                          <v-spacer></v-spacer>
                          <v-btn x-small class="ma-2" outlined fab color="white">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </v-row>
                      </v-alert>
                    </v-flex>
                  </v-layout>

                  <div>
                    <v-card outlined flat class="col-sm-12">
                      <v-card-title color="red">
                        Clientes
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
                        </div>
                      </v-card-title>
                      <v-data-table
                        locale="pt"
                        :headers="tableParcel"
                        :items="parcelDetails.installments"
                        :items-per-page="5"
                        :search="search"
                      >
                        <template v-slot:item.status="{ item }">
                          <v-chip small :color="getColor(item.status)" dark>{{ item.status}}</v-chip>
                        </template>
                        <template v-slot:item.date="{ item }">
                          <div small v-text="convertDate(item.date)" dark></div>
                        </template>
                        <template v-slot:item.client.name="{ item }">
                          <div small v-text="clientNameUpper(item.client.name)" dark></div>
                        </template>
                        <template v-slot:item.acao="{ item }">
                          <v-btn
                            @click="getInstallment(item)"
                            x-small
                            rounded
                            outlined
                            color="primary"
                          >
                            <v-icon left>mdi-eye</v-icon>Visualizar
                          </v-btn>
                        </template>
                      </v-data-table>
                    </v-card>
                  </div>
                </div>
              </div>

              <v-layout row justify-center>
                <v-dialog v-model="innstallment" persistent max-width="700px">
                  <v-card flat>
                    <v-toolbar dense flat dark color="primary">
                      <v-toolbar-title>Detalhes</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn @click="innstallment = false" icon dark>
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <div class="col-sm-12">
                      <v-alert v-show="showAlert" dense text type="info" dismissible>{{msg}}</v-alert>
                      <div class="pa-4 d-flex justify-space-between">
                        <b>Parcela {{installmentsResume.id}}</b>
                        <v-chip small :color="getColor(installmentsResume.status)" dark>
                          <b>{{installmentsResume.status}}</b>
                        </v-chip>
                      </div>
                      <v-layout class="d-flex justify-space-between">
                        <v-flex xs12 sm8 md8 class="mr-3">
                          <v-alert
                            dense
                            outlined
                            icon="mdi-clipboard-alert-outline"
                            border="left"
                            color="indigo"
                            type="error"
                          >
                            <div>Valor da parcela</div>
                            <v-divider></v-divider>
                            <div>
                              <b v-text="convertMoney(installmentsResume.value)"></b>
                            </div>
                          </v-alert>
                        </v-flex>

                        <v-flex xs12 sm6 md4>
                          <v-alert
                            icon="mdi-firework"
                            border="left"
                            color="indigo"
                            dense
                            type="info"
                          >
                            <div>Valor Restante</div>
                            <v-divider></v-divider>
                            <div>
                              <b v-text="convertMoney(installmentsResume.remaing)"></b>
                            </div>
                          </v-alert>
                        </v-flex>
                      </v-layout>
                      <v-layout v-if="parcelRemaing != '0.00'">
                        <v-flex xs12 sm8 md8 class="mr-3">
                          <v-text-field
                            outlined
                            v-model="receiveValue"
                            small
                            dense
                            flat
                            label="Valor á receber"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md4>
                          <v-btn block outlined @click="sendReceive()" color="primary">Receber</v-btn>
                        </v-flex>
                      </v-layout>
                      <v-divider></v-divider>
                      <div class="pa-4 subtitle-2">
                        <b>Historico de Cobrança</b>
                      </div>

                      <div v-if="historic">
                        <v-list v-for="item in historic" :key="item.id" two-line>
                          <v-list-item>
                            <v-list-item-avatar>
                              <v-icon>mdi-calendar-check-outline</v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>{{item.details}}</v-list-item-title>
                              <v-list-item-subtitle v-text="convertMoney(item.amount)"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-list-item-title v-text="convertDate(item.date)"></v-list-item-title>
                              <v-list-item-subtitle>{{item.hour}}</v-list-item-subtitle>
                            </v-list-item-action>
                          </v-list-item>
                          <v-divider></v-divider>
                        </v-list>
                      </div>
                      <div v-else>
                        <v-alert
                          icon="mdi-alert-box"
                          prominent
                          text
                          type="info"
                        >Não existe historico de cobrança para essa parcela</v-alert>
                      </div>
                    </div>
                  </v-card>
                </v-dialog>
              </v-layout>
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
    sheet: false,
    innstallment: false,
    date: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,
    menu2: false,
    boxId: 20,
    search: '',
    contractView: false,
    parcelDetails: [
      {
        planValue: '',
        receive: '',
        pending: '',
        charged: '',
        unsuccessful: '',
        qtdCharged: '',
        qtdUnsuccessful: '',
        qtdReceive: '',
        qtdPending: '',
        qtdParcel: '',
        installments: '',
        clientName: ''
      }
    ],
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
      { text: 'Ações', value: 'action', sortable: false },

    ],
    tableParcel: [
      { text: 'ID', value: 'id' },

      {
        text: 'Cliente',
        align: 'left',
        sortable: true,
        value: 'client.name',
      },
      { text: 'Vencimento', value: 'date' },
      { text: 'Status', value: 'status' },
      { text: 'Ações', value: 'acao', sortable: false },

    ],
    installmentsResume: [
      {
        id: '',
        value: '',
        date: '',
        remaing: '',
        historic: '',
        status: ''
      }
    ],
    parcelValue: '',
    parcelRemaing: '',
    historic: '',
    receiveValue: '',
    showAlert: false,
    msg: '',

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
        //console.log(this.listContracts)
        // document.getElementById('resp').innerHTML = json
      })
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

    clientNameUpper(name) {
      let clientName = name.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')
      return clientName
    },
    convertDate(date) {
      var parts = date.split('-')
      var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydate.toLocaleDateString();
    },
    convertMoney(money) {
      const toCurrency = (n, curr, LanguageFormat = undefined) =>
        Intl.NumberFormat(LanguageFormat, { style: 'currency', currency: curr }).format(n);
      return (toCurrency(money, 'BRL'))


    },
    viewContract(item) {
      this.contractView = true
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
        json.forEach(element => {
          let qtdVencida = 0
          let qtdCobrado = 0
          let qtdPendente = 0
          let qtdRecebida = 0
          let totalVencida = 0
          let totalPendente = 0
          let totalCobrado = 0
          let totalRecebida = 0

          let name = element.client.name.split(' ')
            .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(' ')

          this.parcelDetails.clientName = name
          this.installments = element.installments
          this.parcelDetails.qtdParcel = element.installments.length
          console.log(this.installments);

          //capturando valor do plano
          this.parcelDetails.planValue = element.plan[0].value

          switch (element.status) {
            case 'VENCIDA':
              totalVencida += parseFloat(element.value)
              // this.quantityDefeat = totalVencida
              break;
            case 'PENDENTE':
              totalPendente += parseFloat(element.value)
              // this.quantityPending = totalPendente
              break;
            case 'COBRADO':
              totalCobrada += parseFloat(element.value)
              break;
            case 'RECEBIDA':
              totalRecebida += parseFloat(element.value)
              // this.quantityReceive = totalRecebida
              break;
            default:
              break;
          }
          element.installments.forEach(item => {

            switch (item.status) {
              case 'VENCIDA':
                qtdVencida++
                break;
              case 'PENDENTE':
                qtdPendente++
                break;
              case 'RECEBIDA':
                qtdRecebida++
                break;
              case 'COBRADO':
                qtdCobrado++
                break;
              default:
                break;
            }
            switch (item.status) {
              case 'VENCIDA':
                totalVencida += parseFloat(item.value)
                // this.quantityDefeat = totalVencida
                break;
              case 'PENDENTE':
                totalPendente += parseFloat(item.value)
                // this.quantityPending = totalPendente
                break;
              case 'COBRADO':
                totalCobrado += parseFloat(item.value)
                break;
              case 'RECEBIDA':
                totalRecebida += parseFloat(item.value)
                // this.quantityReceive = totalRecebida
                break;
              default:
                break;
            }
          })
          this.parcelDetails.receive = totalRecebida
          this.parcelDetails.pending = totalPendente
          this.parcelDetails.charged = totalCobrado
          this.parcelDetails.unsuccessful = totalVencida
          this.parcelDetails.qtdCharged = qtdCobrado
          this.parcelDetails.qtdUnsuccessful = qtdVencida
          this.parcelDetails.qtdReceive = qtdRecebida
          this.parcelDetails.qtdPending = qtdPendente
        });
      })
    },
    close() {
      this.contractView = false

    },
    innstallmentDetails(parcel) {
      console.log(parcel);
      let array = []
      array.push(JSON.parse(parcel.historic))

      array.forEach((item, key) => {
        this.historic = item
      })
      this.parcelValue = parcel.value
      this.parcelRemaing = parcel.remaing
      this.installmentsResume.historic = array[0]
      this.installmentsResume.id = parcel.id
      this.installmentsResume.status = parcel.status
      this.installmentsResume.date = parcel.date
      this.installmentsResume.remaing = parcel.remaing
      this.installmentsResume.value = parcel.value
      this.installmentsResume.historic = parcel.historic
      this.innstallment = true
    },
    getInstallment(item) {
      this.contractView = true
      const url = `${vars.host}parcelController.php`;
      let formData = new FormData();
      formData.append("parcelinfo", "true");
      formData.append("parcel-id", item.id);
      localStorage.setItem("parcel-id", item.id);
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          console.log(json);

          let parcel = json[0]

          console.log(parcel.id);
          // document.getElementById('resp').innerHTML = json
          let array = [];
          json.forEach(item => {
            if (item.historic) array.push(JSON.parse(item.historic));
          });
          array.forEach((item, key) => {
            this.installmentsResume.historic = item;
          });
          this.parcelValue = parcel.value
          this.parcelRemaing = parcel.remaing
          this.installmentsResume.id = parcel.id
          this.installmentsResume.status = parcel.status
          this.installmentsResume.date = parcel.date
          this.installmentsResume.remaing = parcel.remaing
          this.installmentsResume.value = parcel.value
          this.installmentsResume.historic = parcel.historic
          this.innstallment = true



          // console.log(status)
          switch (status) {
            case "PENDENTE":
              (this.background = "bg-warning"),
                (this.icon = "mdi mdi-information-outline text-dark");
              this.receive = 1;
              break;
            case "COBRADO":
              this.background = "bg-charged text-white";
              this.icon = "mdi mdi-close-circle-outline text-white";
              this.receive = 2;
              break;
            case "RECEBIDA":
              this.background = "bg-primary text-white";
              this.icon = "mdi mdi-checkbox-marked-circle-outline text-white";
              this.receive = 3;
              break;
            default:
              break;
          }
        });
    },
    sendReceive() {
      if (
        localStorage.getItem("boxId") != "" &&
        localStorage.getItem("boxId") != "null"
      ) {
        let form = new FormData();
        let send = false;
        if (
          parseFloat(this.receiveValue) ==
          parseFloat(this.parcelValue) ||
          parseFloat(this.receiveValue) == parseFloat(this.installmentsResume.remaing)
        ) {
          form.append("status", "RECEBIDA");
          form.append("details", "Pagamento completo");
          send = true;
        }
        if (
          parseFloat(this.receiveValue) < parseFloat(this.installmentsResume.remaing) &&
          parseFloat(this.receiveValue) > 0
        ) {
          form.append("status", "COBRADO");
          form.append("details", "Pagamento parcial");
          send = true;
        }
        let remaing = this.installmentsResume.remaing - this.receiveValue;
        if (remaing == 0) {
          form.append("status", "RECEBIDA");
          form.append("details", "Pagamento final");
        }

        form.append("remaing", remaing);
        form.append("user-id", localStorage.getItem("user-id"));
        form.append("box-id", localStorage.getItem("boxId"));
        form.append("id", this.installmentsResume.id);
        form.append("amount", this.receiveValue);
        form.append("pay", this.receiveValue);
        if (send) {
          const url = `${vars.host}parcelController.php`;
          fetch(url, {
            method: "POST",
            body: form
          })
            .then(resp => {
              return resp.json();
            })
            .then(json => {
              // document.getElementById('resp').innerHTML = json
              // console.log(json);
              this.msg = json.msg;
              this.showAlert = true
              // this.installmentsResume.remaing = remaing
            });
        } else {
          this.msg = "Valor inválido";
          this.snackbar = true;

        }
      } else {
        this.errorCaixa = true;
      }
    },
  }

}
</script>

<style>
</style>    