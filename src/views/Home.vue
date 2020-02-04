<template>
  <v-content white fluid>
    <Menu />
    <div>
      <v-container flat class>
        <v-divider class="pt-2"></v-divider>
        <v-layout class="col-sm-12 d-flex justify-space-between">
          <v-flex xs12 sm6 md3 class="mr-3">
            <v-alert icon="mdi-firework" border="left" color="blue lighten-1" dark outlined>
              <div>{{resumeDay.qtdrecebida}} Recebidas</div>
              <v-divider dark></v-divider>
              <div>
                <div class="title">
                  <b>{{resumeDay.recebida}}</b>
                </div>
              </div>
            </v-alert>
          </v-flex>
          <v-flex xs12 sm6 md3 class="mr-3">
            <v-alert icon="mdi-firework" border="left" color="blue lighten-1" dark outlined>
              <div>
                {{resumeDay.qtdvencida}} Vencidas
                <b></b>
              </div>
              <v-divider></v-divider>
              <div class="title">
                <b>{{resumeDay.vencida}}</b>
              </div>
            </v-alert>
          </v-flex>
          <v-flex xs12 sm6 md3 class="mr-3">
            <v-alert icon="mdi-firework" border="left" color="blue lighten-1" dark outlined>
              <div>
                {{resumeDay.qtdcobrada}} Cobradas
                <b></b>
              </div>
              <v-divider></v-divider>
              <div class="title">
                <b>{{resumeDay.cobrada}}</b>
              </div>
            </v-alert>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-alert icon="mdi-firework" border="left" color="blue lighten-1" dark outlined>
              <div>
                {{resumeDay.qtdpendente}} Pendentes
                <b></b>
              </div>
              <v-divider></v-divider>
              <div class="title">
                <b>{{resumeDay.pendente}}</b>
              </div>
            </v-alert>
          </v-flex>
        </v-layout>
        <div fluid>
          <div>
            <v-card outlined flat class="col-sm-12">
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
                        v-model="dateConverted"
                        label="Data"
                        outlined
                        dense
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker locale="pt-br" v-model="date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date), dateFinal = date"
                      >OK</v-btn>
                    </v-date-picker>
                  </v-menu>

                  <v-menu
                    ref="menuFinal"
                    v-model="menuFinal"
                    :close-on-content-click="false"
                    :return-value.sync="dateFinal"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        class="mr-5"
                        v-model="dateConvertedFinal"
                        label="Data"
                        outlined
                        dense
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker locale="pt-br" v-model="dateFinal" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menuFinal = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.menuFinal.save(dateFinal)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>

                  <v-btn class="mr-5" dark color="primary" @click="installmentsAll()">Buscar</v-btn>
                  <v-spacer></v-spacer>
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
                  <v-btn @click="newloan = true" color="blue lighten-1" dark>Novo emprestimo</v-btn>
                </div>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="listParcel"
                :search="search"
                :items-per-page="5"
              >
                <template v-slot:item.client.name="{ item }">
                  <div small v-text="clientNameUpper(item.client.name)" dark></div>
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip x-small :color="getColor(item.status)" dark>
                    {{
                    item.status
                    }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card>
          </div>
        </div>
      </v-container>
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
</template>
<script>
import vars from "../plugins/env.local";
import Menu from "../components/Menu";
export default {
  components: {
    Menu
  },
  mounted: function() {
    // `this` points to the vm instance
    this.unsuccessful();
    this.installmentsAll();
    this.listAllPlans();
    this.verifyLogin();
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    dateFinal: new Date().toISOString().substr(0, 10),
    menu: false,
    menuFinal: false,
    modal: false,
    menu2: false,
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
    search: "",
    tab: null,
    parcel: [],
    interval: {},
    value: 0,
    plans: [],
    tabs: null,
    Buscar: "",
    search: "",
    listParcel: [],
    headers: [
      {
        text: "Código",
        align: "left",
        value: "id"
      },
      { text: "Cliente", value: "client.name" },
      { text: "Vencimento", value: "date" },
      { text: "Status", value: "status" }
    ],
    resumeDay: {
      recebida: 0,
      pendente: 0,
      vencida: 0,
      cobrada: 0,
      qtdrecebida: 0,
      qtdpendente: 0,
      qtdvencida: 0,
      qtdcobrada: 0
    }
  }),
  computed: {
    dateConverted: function() {
      var parts = this.date.split(" ")[0].split("-");
      var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydate.toLocaleDateString();
    },
    dateConvertedFinal: function() {
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
    clientNameUpper(name) {
      let clientName = name
        .split(" ")
        .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
        .join(" ");
      return clientName;
    },
    unsuccessful() {
      const url = `${vars.host}parcelController.php`;
      let formData = new FormData();
      formData.append("unsuccessful", "true");
      fetch(url, {
        method: "POST",
        body: formData
      }).then(resp => {
        return resp.json();
      });
    },
    clear() {
      this.resumeDay.qtdvencida = 0;
      this.resumeDay.vencida = 0;
      this.resumeDay.qtdpendente = 0;
      this.resumeDay.pendente = 0;
      this.resumeDay.qtdcobrada = 0;
      this.resumeDay.cobrada = 0;
      this.resumeDay.qtdrecebida = 0;
      this.resumeDay.recebida = 0;
    },
    installmentsAll() {
      this.clear(); // zera as variaves para incrementar os novos valores
      this.isLoading = true;
      const url = `${vars.host}parcelController.php`;
      let formData = new FormData();
      formData.append("filter", "true");
      formData.append("date-initial", this.date);
      formData.append("date-final", this.dateFinal);
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          console.log(json);
          this.listParcel = json;
          json.forEach(item => {
            switch (item.status) {
              case "VENCIDA":
                this.resumeDay.qtdvencida++;
                this.resumeDay.vencida += parseFloat(item.value);
                break;
              case "PENDENTE":
                this.resumeDay.qtdpendente++;
                this.resumeDay.pendente += parseFloat(item.value);
                break;
              case "COBRADO":
                this.resumeDay.qtdcobrada++;
                this.resumeDay.cobrada += parseFloat(item.value);
                break;
              case "RECEBIDA":
                this.resumeDay.qtdrecebida++;
                this.resumeDay.recebida += parseFloat(item.value);
                break;
              default:
                break;
            }
          });
        });
    },

    getColor(status) {
      switch (status) {
        case "VENCIDA":
          return "red";
          break;
        case "COBRADO":
          return "purple darken-3";
          break;
        case "RECEBIDA":
          return "primary";
          break;
        case "PENDENTE":
          return "amber";
          break;
        default:
          break;
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
    }
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
};
</script>

<style></style>
