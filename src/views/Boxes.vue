<template>
  <div>
    <Menu />
    <div class="col-sm-12">
      <v-content white fluid>
        <div class="col-sm-12">
          <v-divider></v-divider>
        </div>
        <v-card flat class="col-sm-12">
          <v-card-title dense class="pa-1 v-card-title">
            <div class="col-sm-12 d-flex justify-space-between">
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
                      v-model="dateConverted"
                      label="Data inicial"
                      outlined
                      dense
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker locale="pt-br" v-model="date" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date), getBoxDay(date) ">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <div>
                  <v-text-field
                    outlined
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                    dense
                    class="mr-2"
                  ></v-text-field>
                </div>
              </div>
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
              <v-chip small :color="getColor(item.status)" dark>
                {{
                item.status
                }}
              </v-chip>
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
                <v-toolbar-title>
                  Caixa
                  <b>{{ boxResume.id }}</b>
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-divider></v-divider>
              <div class="container pa-3 col-sm-12">
                <div class="d-flex justify-space-between">
                  <v-spacer></v-spacer>
                  <div>
                    <v-chip small :color="getColor(boxResume.status)" dark>
                      <b>{{ boxResume.status }}</b>
                    </v-chip>
                  </div>
                </div>
                <v-divider class="mb-5 mt-4"></v-divider>
                <v-layout class="col-sm-12 d-flex justify-space-between">
                  <v-flex xs12 sm6 md3 class="mr-3">
                    <v-alert icon="mdi-firework" border="left" color="indigo accent-3" dark>
                      <div>
                        Saldo
                        <b></b>
                      </div>
                      <v-divider></v-divider>
                      <div>
                        <b v-text="convertMoney(boxResume.valueTotal)"></b>
                      </div>
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm6 md3 class="mr-3">
                    <v-alert icon="mdi-firework" border="left" color="indigo accent-3" dark>
                      <div>Entradas</div>
                      <v-divider></v-divider>
                      <div>
                        <b v-text="convertMoney(boxResume.inputs)"></b>
                      </div>
                    </v-alert>
                  </v-flex>

                  <v-flex xs12 sm6 md3 class="mr-3">
                    <v-alert
                      icon="mdi-clipboard-alert-outline"
                      border="left"
                      color="indigo accent-3"
                      dark
                    >
                      <div>Saídas</div>
                      <v-divider></v-divider>
                      <div>
                        <b v-text="convertMoney(boxResume.outputs)"></b>
                      </div>
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm6 md3 class="mr-3 pb-1">
                    <v-alert
                      icon="mdi-clipboard-check-outline"
                      border="left"
                      color="indigo accent-3"
                      dark
                    >
                      <div>Suprimento incial</div>
                      <v-divider></v-divider>
                      <div>
                        <b v-text="convertMoney(boxResume.openValue)"></b>
                      </div>
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm6 md3>
                    <v-alert border="left" color="success" dark>
                      <div>Usúario</div>
                      <v-divider></v-divider>
                      <div small v-text="boxResume.user" dark></div>
                    </v-alert>
                  </v-flex>
                </v-layout>
                <v-card flat class="col-sm-12">
                  <v-card-title color="red">
                    Transações
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
                    :headers="headersParcel"
                    :items="boxResume.installmentsBox"
                    :items-per-page="5"
                    :search="search"
                  >
                    <template v-slot:item.installment[0].status="{ item }">
                      <v-chip
                        small
                        :color="getColor(item.installment[0].status)"
                        dark
                      >{{ item.installment[0].status}}</v-chip>
                    </template>

                    <template v-slot:item.installment[0].client.name="{ item }">
                      <div small v-text="clientNameUpper(item.installment[0].client.name)" dark></div>
                    </template>
                    <template v-slot:item.installment[0].value="{ item }">
                      <div small v-text="convertMoney(item.installment[0].value)" dark></div>
                    </template>
                    <template v-slot:item.recinValue="{ item }">
                      <div small v-text="convertMoney(item.recinValue)" dark></div>
                    </template>
                    <template v-slot:item.acao="{ item }">
                      <v-btn
                        @click="getInstallment(item.installment[0].id)"
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
            </v-card>
          </v-dialog>
        </v-row>
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
      </v-content>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu";
import vars from "../plugins/env.local";
const url = `${vars.host}boxController.php`;
export default {
  components: {
    Menu
  },
  mounted: function () {
    this.getBoxDay();
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    dateFinal: new Date().toISOString().substr(0, 10),
    menu: false,
    menuFinal: false,
    search: "",
    innstallment: false,
    detailsBox: false,
    menu: false,
    modal: false,
    menu2: false,
    boxId: 20,
    BoxList: [],
    headers: [
      { text: "ID", value: "boxId" },
      {
        text: "Data",
        align: "left",
        sortable: true,
        value: "openDate"
      },
      { text: "Usuário", value: "userInfo[0].name" },
      { text: "Status", value: "status" },
      { text: "Ações", value: "acao", sortable: false }
    ],
    headersParcel: [
      { text: "Código", value: "installment[0].id" },
      {
        text: "Cliente",
        align: "left",
        sortable: true,
        value: "installment[0].client.name"
      },
      { text: "Parcela", value: "installment[0].value" },
      { text: "Recebido", value: "recinValue" },

      { text: "Status", value: "installment[0].status" },
      { text: "Ações", value: "acao", sortable: false }
    ],
    boxResume: {
      id: "",
      dateOpen: "",
      user: "",
      status: "",
      openvalue: '',
      valueTotal: '',
      inputs: '',
      outputs: '',
      installmentsBox: [],
    },
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
  computed: {
    dateConverted: function () {
      var parts = this.date.split(" ")[0].split("-");
      var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydate.toLocaleDateString();
    },
    dateConvertedFinal: function () {
      var parts = this.dateFinal.split(" ")[0].split("-");
      var mydateFinal = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydateFinal.toLocaleDateString();
    }
  },
  methods: {
    convertDate(date) {
      var parts = date.split(" ")[0].split("-");
      var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydate.toLocaleDateString();
    },
    convertMoney(money) {
      const toCurrency = (n, curr, LanguageFormat = undefined) =>
        Intl.NumberFormat(LanguageFormat, { style: 'currency', currency: curr }).format(n);
      return (toCurrency(money, 'BRL'))
    },
    clientNameUpper(name) {
      let clientName = name
        .split(" ")
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(" ");
      return clientName;
    },
    getBoxDay(date = this.date) {
      let form = new FormData();
      form.append("get-box-day", "true");
      form.append("date", this.date);
      fetch(url, {
        method: "POST",
        body: form
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          // let json = JSON.parse(obj)
          console.log(json);
          this.BoxList = json;
          // alert(json.msg)
          // document.getElementById('resp').innerHTML = json
        });
    },
    day(dialog) {
      // console.log(this.date)
      this.getBoxDay(this.date);
      this.modal = false;
      dialog.save(this.date);
    },
    getColor(status) {
      if (status == "ABERTO") return "primary";
      else if (status == "FECHADO") return "orange";
      else if (status == "VENCIDA") return "red";
      else if (status == "RECEBIDA") return "primary";
      else if (status == "PENDENTE") return "amber";
      else if (status == "COBRADO") return "purple darken-3";
      else if (status == "CANCELADO") return "red";
      else return "green";
    },
    viewBox(item) {
      this.detailsBox = true;
      let formData = new FormData();
      formData.append("box-details", "true");
      formData.append("box-id", item.boxId);
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {

          this.boxResume.installmentsBox = json.installments

          this.boxResume.valueTotal = json.valueTotal
          this.boxResume.inputs = json.inputs
          this.boxResume.outputs = json.outputs
          let resumeBox = [];
          json.boxInfo.forEach(resumeBox => {
            this.boxResume.id = resumeBox.boxId;
            this.boxResume.status = resumeBox.status;
            this.boxResume.openValue = resumeBox.openValue;
          });
          this.boxResume.user = json.boxInfo[0].userInfo[0].name
            .split(" ")
            .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(" ");
        });

    },
    getInstallment(item) {
      this.contractView = true
      const url = `${vars.host}parcelController.php`;
      let formData = new FormData();
      formData.append("parcelinfo", "true");
      formData.append("parcel-id", item);
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
              this.getInstallment(this.installmentsResume.id)

            })
        } else {
          this.msg = "Valor inválido";
          this.snackbar = true;

        }
      } else {
        this.errorCaixa = true;
      }
    },
    searchFilter() {
      const url = `${vars.host}parcelController.php`
      let formData = new FormData()
      formData.append('filter', 'true')
      formData.append('user-id', localStorage.getItem('user-id'))
      formData.append('client-id', this.idClient)
      formData.append('status', this.parcel)
      formData.append('date-initial', this.date1)
      formData.append('date-final', this.date2)
      // document.getElementById('load').classList.remove('hide')
      fetch(url, {
        method: 'POST',
        body: formData
      }).then(resp => {
        return resp.json()
      }).then(json => {


      })
    },
  }
};
</script>

<style>
.v-card-title {
  height: 80px;
}
</style>
