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
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small>mdi-trash-can</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Menu from '../components/Menu';
import vars from '../plugins/env.local'

export default {
  components: {
    Menu,
  },
  mounted: function () {
    this.getBoxDay()
  },
  data: () => ({
    search: '',
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
      const url = `${vars.host}boxController.php`
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
  }
}
</script>

<style>
</style>