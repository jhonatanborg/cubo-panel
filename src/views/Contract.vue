<template>
  <div>
    <Menu />
    <v-content white fluid>
      <div class="col-sm-12">
        <v-card flat class="col-sm-12">
          <div class="d-flex justify-end" flat>
            <v-btn @click="newloan = true" color="blue lighten-1" dark>Novo contrato</v-btn>
          </div>
        </v-card>
        <div class="col-sm-12">
          <v-divider></v-divider>
        </div>
        <v-card c class="col-sm-12" flat>
          <v-card-title color="red">
            <div class="d-flex justify-space-between">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="mr-5"
                    v-model="date"
                    label="Data inicial"
                    outlined
                    dense
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker locale="pt-br" v-model="date" no-title type="month" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date), getContractsDay(date)"
                  >OK</v-btn>
                </v-date-picker>
              </v-menu>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                outlined
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
                    <div v-text="clientNameUpper(parcelDetails.clientName)"></div>
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
                  <v-card flat class="col-sm-12">
                    <v-card-title color="red">
                      Parcelas do contrato
                      <v-spacer></v-spacer>
                      <div class="d-flex justify-space-between">
                        <v-text-field
                          v-model="search"
                          append-icon="mdi-magnify"
                          label="Buscar"
                          single-line
                          hide-details
                          outlined
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
                          @click="getInstallment(item.id)"
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
                    <v-alert v-show="showAlert" dense text :type="feedback" dismissible>{{msg}}</v-alert>
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
                        <v-alert icon="mdi-firework" border="left" color="indigo" dense type="info">
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
                          type="number"
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
      <v-layout row justify-center>
        <v-dialog v-model="newloan" persistent max-width="700px">
          <v-card flat>
            <v-toolbar dense flat dark color="primary">
              <v-toolbar-title>Novo Emprestimo</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn @click="newloan = false" icon dark>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-progress-linear
              :active="loading"
              :indeterminate="loading"
              absolute
              height="5"
              color="deep-purple accent-4"
            ></v-progress-linear>
            <div class="col-sm-12">
              <v-alert v-show="succesAlert" dense text type="info" dismissible>{{msg}}</v-alert>
              <v-alert v-show="errorAlert" dense text type="error" dismissible>{{msg}}</v-alert>
              <v-card flat class="pa-4">
                <v-autocomplete
                  class="mb-5"
                  v-model="planSelect.idClient"
                  :items="items"
                  outlined
                  :loading="isLoading"
                  :search-input.sync="search"
                  chips
                  dense
                  clearable
                  hide-details
                  hide-selected
                  item-text="name"
                  item-value="id"
                  label="Buscar empresa..."
                >
                  <template v-slot:selection="{ attr, on, item, selected }">
                    <v-chip
                      v-bind="attr"
                      :input-value="selected"
                      color="blue-grey"
                      class="white--text"
                      v-on="on"
                      small
                    >
                      <span v-text="item.name"></span>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar
                      color="indigo"
                      class="headline font-weight-light white--text"
                    >{{ item.name.charAt(0) }}</v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
                <div>
                  <v-select
                    v-model="planSelect.idPlano"
                    dense
                    :items="plans"
                    @change="onChange"
                    label="Selecione plano"
                    outlined
                    item-text="value"
                    item-value="id"
                  ></v-select>
                </div>
                <div class>
                  <div class="mb-2">Quantidade de parcelas</div>
                  <v-radio-group
                    v-model="planSelect.quantityParcel"
                    class="d-flex justify-space-between"
                  >
                    <v-radio color="primary" value="11" v-bind:label="'11 parcelas de ' + this.p11"></v-radio>
                    <v-radio color="primary" value="24" v-bind:label="'24 parcelas de ' + this.p24"></v-radio>
                  </v-radio-group>
                </div>
                <div class>
                  <div class="mb-2">Cobrar finais de semana</div>
                  <div class="d-flex justify-space-between">
                    <v-checkbox
                      color="primary"
                      label="Sábado"
                      v-model="planSelect.daysValue"
                      value="1"
                    ></v-checkbox>
                    <v-checkbox
                      color="primary"
                      label="Domingo"
                      v-model="planSelect.daysValue"
                      value="2"
                    ></v-checkbox>
                  </div>
                </div>
                <v-btn block color="primary" @click="getInstallments()" dark>Confirmar</v-btn>
              </v-card>
            </div>
          </v-card>
        </v-dialog>
      </v-layout>
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
    this.listAllPlans();
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    dateFinal: new Date().toISOString().substr(0, 10),
    menu: false,
    menu: false,
    msg: "",
    succesAlert: false,
    errorAlert: false,
    loading: false,
    newloan: false,
    p11: "",
    p24: "",
    planSelect: {
      idClient: "",
      idPlano: "",
      planValue: "",
      quantityParcel: "",
      parcelValue: "",
      daysValue: [],
      installments: []
    },
    row: null,
    isLoading: false,
    items: [],
    idClient: "",
    parcel: [],
    interval: {},
    value: 0,
    plans: [],
    Buscar: "",
    listParcel: [],
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
    viewContractId: '',
    feedback: "error",

  }),
  computed: {
    dateConverted: function () {


    },
    dateConvertedFinal: function () {
      var parts = this.dateFinal.split(" ")[0].split("-");
      var mydateFinal = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydateFinal.toLocaleDateString();
    }
  },
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

    clientNameUpper(name = "Nome") {
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
      this.viewContractId = item.id
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
          this.parcelDetails.clientName = element.client.name
          this.installments = element.installments
          this.parcelDetails.qtdParcel = element.installments.length
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
      this.historic = null
      this.contractView = true
      const url = `${vars.host}parcelController.php`;
      let formData = new FormData();
      formData.append("parcelinfo", "true");
      formData.append("parcel-id", item);
      localStorage.setItem("parcel-id", item);
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          let parcel = json[0]
          let array = [];
          json.forEach(item => {
            if (item.historic) array.push(JSON.parse(item.historic));
          });
          array.forEach((item, key) => {
            this.historic = item;
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


              this.msg = json.msg;
              this.showAlert = true
              this.feedback = "info"
              this.getInstallment(this.installmentsResume.id)
              let item = {
                id: this.viewContractId
              }
              this.viewContract(item)
              this.installmentsResume.remaing = remaing
            })
        } else {
          this.msg = "Valor inválido";
          this.snackbar = true;
          this.showAlert = true
          this.feedback = "error"

        }
      } else {
        this.showAlert = true;
        this.feedback = "error"
        this.msg = "O caixa está fechado abra para fazer o recebimento"

      }
    },
    getInstallments() {
      let today = new Date();
      let d = today.getDate() + 1;
      let m = today.getMonth();
      let y = today.getFullYear();
      let obj = [];
      let verificar = [];
      let curdate = [];
      let number = 1;
      this.plans.forEach(element => {
        if (element.id == this.planSelect.idPlano) {
          this.p11 = element.p11;
          if (this.planSelect.quantityParcel == 11) {
            return (this.planSelect.parcelValue = element.p11);
          } else {
            return (this.planSelect.parcelValue = element.p24);
          }
        }
      });
      let cobrar = this.planSelect.daysValue || "";
      for (let i = 0; i < this.planSelect.quantityParcel; i++) {
        let date = new Date(y, m, d + i);
        let array;
        let dataStr = date.toString();
        if (dataStr.indexOf("Sat") < 0) {
          array = [
            this.planSelect.parcelValue,
            date.toLocaleDateString("pt-br"),
            number,
            "cobrar"
          ];
        }
        if (dataStr.indexOf("Sun") < 0) {
          array = [
            this.planSelect.parcelValue,
            date.toLocaleDateString("pt-br"),
            number,
            "cobrar"
          ];
        }
        if (cobrar.indexOf("1") < 0 && dataStr.indexOf("Sat") >= 0) {
          array = [
            this.planSelect.parcelValue,
            date.toLocaleDateString("pt-br"),
            number,
            "não-cobrar"
          ];
          this.planSelect.quantityParcel++;
          number--;
        }
        if (cobrar.indexOf("2") < 0 && dataStr.indexOf("Sun") >= 0) {
          array = [
            this.planSelect.parcelValue,
            date.toLocaleDateString("pt-br"),
            number,
            "não-cobrar"
          ];
          this.planSelect.quantityParcel++;
          number--;
        }
        verificar.push(array);
        if (array[3] === "cobrar") obj.push(array);

        number++;
      }
      this.planSelect.installments = obj;
      this.confirm();
      this.getContractsDay()

    },
    confirm() {
      this.loading = true;
      const url = `${vars.host}contractController.php`;
      let form = new FormData();
      form.append("confirm", "true");
      let json = JSON.stringify(this.planSelect.installments);
      form.append("parcelas", json);
      form.append("plan-id", this.planSelect.idPlano);
      form.append("client-id", this.planSelect.idClient);
      form.append("user-id", "3");
      fetch(url, {
        method: "POST",
        body: form
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          this.msg = json.msg;
          // document.getElementById("respp").innerHTML = json
          if (json.msg.indexOf("Sucesso") > 0) {
            this.succesAlert = true;
            // alert(json.msg)
            // this.$router.push('home')
            this.loading = false;
            this.getContractsDay()
            this.newloan = false
          } else {
            this.errorAlert = true;

          }
        });
    },
    onChange(event) {
      this.plans.forEach(p => {
        if (p.id == event) {
          this.p11 = p.p11;
          this.p24 = p.p24;
        }
      });
    },
    verifyLogin() {
      if (
        !localStorage.getItem("user-id") &&
        !localStorage.getItem("user-name")
      ) {
        this.$router.push("/");
      }
    },
    listAllPlans() {
      const url = `${vars.host}planController.php`;
      let formData = new FormData();
      formData.append("all-plans", "true");
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          this.plans = json;
        });
    },
  },
  watch: {
    model(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
    },
    loading(val) {
      if (!val) return;

      setTimeout(() => (this.loading = false), 3000);
    },

    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;
      this.isLoading = true;
      const url = `${vars.host}clientController.php`;
      let formData = new FormData();
      formData.append("all-clients", "true");
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          json.forEach(item => {
            this.items.push(item);
          });
        })
        .finally(() => (this.isLoading = false));
    }
  }

}
</script>

<style>
</style>    