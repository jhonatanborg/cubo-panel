<template>
  <div id="white">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template>
          <v-list-item to="/home" color="primary">
            <v-list-item-action>
              <v-icon>mdi-view-dashboard-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="clients" color="primary">
            <v-list-item-action>
              <v-icon>mdi-account-multiple-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Clientes</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="contract" color="primary">
            <v-list-item-action>
              <v-icon>mdi-note-multiple-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Contratos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="boxes" color="primary">
            <v-list-item-action>
              <v-icon>mdi-animation-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Caixas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="users" color="primary">
            <v-list-item-action>
              <v-icon>mdi-clipboard-account-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Usuarios</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      dense
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue lighten-1"
      flat
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down text-white">Cubo Painel</span>
      </v-toolbar-title>
      <v-spacer />

      <v-btn v-show="stateBox != 'ABERTO'" @click="openBoxUser = true " icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn v-if="stateBox == 'ABERTO'" @click="closeBoxUser = true " icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>

      <v-btn @click="logout()" icon>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img src="../assets/logo.png" alt="Vedas Sistemas" />
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <v-dialog v-model="openBoxUser" persistent max-width="400px">
      <v-card flat>
        <v-toolbar dense flat dark color="primary">
          <v-toolbar-title>Caixa</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="openBoxUser = false, alert = false " icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="col-sm-12">
          <v-alert
            dark
            dense
            icon="mdi-alert-outline"
            prominent
            text
            v-model="alert"
            type="info"
          >{{msg}}</v-alert>
          <v-list flat nav hide-overlay>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-lock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="clientNameUpper(username)"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>

            <v-divider></v-divider>
          </v-list>
          <div class>
            <v-text-field 
            type="number"
            v-model="valueBoxOpen" label="Suprimento" outlined dense></v-text-field>
          </div>
          <!-- <v-alert v-show="succesAlert" dense text type="info" dismissible>{{msg}}</v-alert>
          <v-alert v-show="errorAlert" dense text type="error" dismissible>{{msg}}</v-alert>-->
          <v-select :items="select" v-model="selectRouter" outlined dense label="Rota"></v-select>
          <v-btn block color="primary" @click="openBox()">Confirmar</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="closeBoxUser" persistent max-width="400px">
      <v-card flat>
        <v-toolbar dense flat dark color="primary">
          <v-toolbar-title>Caixa</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="closeBoxUser = false, alert = false " icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div class="col-sm-12">
          <v-list flat nav hide-overlay>
            <v-alert v-show="alert == true" type="info" dense text dismissible>{{msg}}</v-alert>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account-lock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="clientNameUpper(username)"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-text="convertMoney(receiveds)"></v-list-item-title>
                <v-list-item-subtitle>Saldo do caixa</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-text="convertMoney(inputs)"></v-list-item-title>
                <v-list-item-subtitle>Entradas</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-text="convertMoney(outputs)"></v-list-item-title>
                <v-list-item-subtitle>Saídas</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title v-text="convertMoney(oldValue)"></v-list-item-title>
                <v-list-item-subtitle>Suprimento Inicial</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-list>

          <v-btn block color="primary" @click="closeBox()">Confirmar</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vars from '../plugins/env.local'

export default {

  name: "Menu",
  props: {
    source: String,
  },

  mounted: function () {
    // `this` points to the vm instance
    this.verifyBox();
    this.getBoxValues();
    this.monitoringLocalStorage()
  },
  updated: function () {
    this.verifyBox();
    // this.levelVerify();
  },
  data: () => ({
    feedBackBox: "info",
    alert: false,
    msg: '',
    oldValue: 0,
    receiveds: 0,
    inputs: 0,
    outputs: 0,
    valueDay: 0,
    totalValue: 0,
    selectRouter: "",
    valueBoxOpen: "",
    username: localStorage.getItem("user-name"),
    datenow: "",
    select: ["Sinop", "Sorriso", "Santa Carmem", "Claudia"],
    dialog: false,
    drawer: true,
    openBoxUser: false,
    closeBoxUser: false,
    stateBox: "",

  }),
  methods: {
    monitoringLocalStorage() {
      if (!localStorage.getItem('user-id') || !localStorage.getItem('level')) {
        this.logout()
      }
      if (localStorage.getItem('boxStatus') == 'ABERTO' && localStorage.getItem('boxId') == 'null') {
        this.logout()
      }

      if (localStorage.getItem('boxStatus') != 'ABERTO' && localStorage.getItem('boxStatus') != 'FECHADO') {
        this.logout()
      }
    },
    clientNameUpper(name) {
      let clientName = name.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' ')
      return clientName
    },
    openBox() {
      localStorage.setItem("boxStatus", this.stateBox);
      const url = `${vars.host}boxController.php`;
      let formData = new FormData();
      formData.append("open-box", "true");
      formData.append("value", this.valueBoxOpen);
      formData.append("route", this.selectRouter);
      formData.append("user-id", localStorage.getItem("user-id"));
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          if (json.boxInfo) {
            localStorage.setItem("boxStatus", "ABERTO");
            localStorage.setItem("boxId", json.boxInfo[0].boxId);
            this.msg = json.msg
            this.stateBox = json.boxInfo[0].status
            this.getBoxValues()
            this.alert = true

          } else {
            this.msg = json.msg
            this.alert = true

            localStorage.setItem("boxStatus", json.statusBox);
            localStorage.setItem("boxId", json.boxId);
            this.getBoxValues()
            setTimeout(() => {
              this.alert = false
            }, 10000);
          }


        });
    },
    closeBox() {
      localStorage.setItem("boxStatus", this.stateBox);
      const url = `${vars.host}boxController.php`;
      let formData = new FormData();
      formData.append("close-box", "true");
      formData.append("value-final", this.totalValue);
      formData.append("box-id", localStorage.getItem("boxId"));
      formData.append("user-id", localStorage.getItem("user-id"));
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(resp => {
          return resp.json();
        })
        .then(json => {
          this.msg = json.msg
          this.alert = true
          localStorage.setItem("boxStatus", "FECHADO");
          localStorage.setItem("boxId", null);
          setTimeout(() => {
            this.alert = false
          }, 10000);
          this.verifyBox()
        });
    },
    getBoxValues() {
      // localStorage.setItem("boxStatus", this.stateBox);
      if (this.stateBox == "ABERTO") {
        const url = `${vars.host}boxController.php`;
        let formData = new FormData();
        formData.append("get-box-values", "true");
        formData.append("box-id", localStorage.getItem("boxId"));
        formData.append("user-id", localStorage.getItem("user-id"));
        fetch(url, {
          method: "POST",
          body: formData
        })
          .then(resp => {
            return resp.json();
          })
          .then(json => {
            // document.getElementById('resp').innerHTML = json
            this.inputs = json.inputs;
            this.outputs = json.outputs;
            this.receiveds = json.receiveds;
            this.totalValue = json.valueTotal;
            this.oldValue = json.boxInfo[0].openValue;
          });
      }
    },
    verifyBox() {
      let date = new Date(),
        mouth = (date.getMonth() + 1).toString().padStart(2, "0");
      this.datenow = date.getDate() + "/" + mouth + "/" + date.getFullYear();
      this.stateBox = localStorage.getItem("boxStatus");
    },
    userVerify() {
      this.nameUser = localStorage.getItem("user-name");
    },
    levelVerify() {
      let levelAdm = localStorage.getItem("level");
      if (levelAdm === "Administrador") {
        this.levelAdm = true;
      } else {
        this.levelAdm = false;
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/");
    },
    convertMoney(money) {
      const toCurrency = (n, curr, LanguageFormat = undefined) =>
        Intl.NumberFormat(LanguageFormat, {
          style: "currency",
          currency: curr
        }).format(n);
      return toCurrency(money, "BRL");
    },
    convertDate(date) {
      var parts = date.split("-");
      var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
      return mydate.toLocaleDateString();
    }
  }
}
</script>