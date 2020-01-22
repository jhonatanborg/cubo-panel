<template>
  <div class="col-sm-12 mr-2">
    <v-card>
      <v-card-title color="red">
        Clientes
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
          <v-btn @click.stop="dialog = true" color="primary">Novo cliente</v-btn>
        </div>
      </v-card-title>
      <v-data-table
        locale="pt"
        :headers="headers"
        :items="clients"
        :items-per-page="5"
        :search="search"
        class="elevation-0"
      >
        <template v-slot:item.status="{ item }">
          <v-chip small :color="getColor(item.status)" dark>{{ item.status}}</v-chip>
        </template>
        <template v-slot:item.acao="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small>mdi-trash-can</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Novo Cliente</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  dense
                  v-model="editedItem.name"
                  outlined
                  label="Cliente nome"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" outlined sm="6">
                <v-text-field
                  label="Telefone"
                  persistent-hint
                  outlined
                  required
                  dense
                  v-model="editedItem.tel"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  dense
                  v-model="editedItem.type"
                  outlined
                  :items="['Jurídica', 'Fisíca']"
                  label="Tipo"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.doc" dense outlined label="CPF - CNPJ"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.adress.street"
                  dense
                  outlined
                  label="Endereço"
                  type="text"
                  hint="Digite o nome da rua, avenida ou logradouro"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" md="2">
                <v-text-field
                  v-model="editedItem.adress.number"
                  dense
                  outlined
                  label="Nº"
                  type="text"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <v-select
                  dense
                  v-model="editedItem.adress.district"
                  outlined
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Bairro"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="8">
                <v-text-field
                  v-model="editedItem.adress.complement"
                  dense
                  outlined
                  label="Complemento"
                  type="text"
                  hint="Adicione um complemento"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="editedItem.adress.cep"
                  dense
                  outlined
                  label="CEP"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="registerClient()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import vars from '../plugins/env.local'
const url = `${vars.host}clientController.php`

export default {
  name: "ListClient",
  props: {
  },
  created: function () {
    // `this` points to the vm instance
    this.listAllCompanies()
  },
  data: () => ({
    dialog: false,
    search: '',
    components: [],
    clients: [],
    idNumber: Number,
    headers: [
      { text: 'ID', value: 'id' },

      {
        text: 'Cliente',
        align: 'left',
        sortable: true,
        value: 'name',
      },
      { text: 'Telefone', value: 'tel' },
      { text: 'CPF/CNPJ', value: 'doc' },
      { text: 'Tipo', value: 'type' },
      { text: 'Status', value: 'status' },
      { text: 'Ações', value: 'acao', sortable: false },

    ],
    editedIndex: -1,
    client: "",
    desserts: [],
    editedItem: {
      name: '',
      doc: '',
      type: '',
      cnpj: '',
      phone: '',
      adress: {
        street: '',
        district: "",
        number: "",
        cep: "",
        complement: "",
      },
    },
     defaultItem: {
      name: '',
      doc: '',
      type: '',
      cnpj: '',
      phone: '',
      adress: {
        street: '',
        district: "",
        number: "",
        cep: "",
        complement: "",
      },
    },
  }),
  methods: {

    getColor(status) {
      if (status == "Ativo") return 'primary'
      else if (status == "Inativo") return 'orange'
      else return 'green'
    },
    listAllCompanies() {
      const url = `${vars.host}clientController.php`
      let formData = new FormData()
      formData.append('all-clients', 'true')
      fetch(url, {
        method: 'POST',
        body: formData
      }).then(resp => {
        return resp.json()
      }).then(json => {
        json.forEach(item => {
          this.clients.push(item)
        })
        var clients = this.clients
        var ultimo = clients[clients.length - 1];
        this.idNumber = parseInt(ultimo.id)
      })
    },
    registerClient() {
      if (this.type == "Fisíca") {
        let form = new FormData()
        form.append('register-client', 'true')
        form.append('street', this.address)
        form.append('district', this.district)
        form.append('number', this.number)
        form.append('cep', this.cep)
        form.append('complement', this.complement)
        form.append('name', this.client)
        form.append('doc', this.doc)
        form.append('tel', this.phone)
        form.append('type', this.type)
        fetch(url, {
          method: 'POST',
          body: form
        }).then(resp => {
          return resp.json()
        }).then(json => {
          console.log(json.client_id)
          this.clients.push({
            id: json.client_id,
            name: this.client,
            tel: this.phone,
            doc: this.doc,
            type: this.type,
            status: "Ativo"
          })
          console.log(this.idNumber)

        })
      } else {

        let form = new FormData()
        form.append('register-client', 'true')
        form.append('street', this.address)
        form.append('district', this.district)
        form.append('number', this.number)
        form.append('cep', this.cep)
        form.append('complement', this.complement)
        form.append('name', this.client)
        form.append('doc', this.doc)
        form.append('tel', this.phone)
        form.append('type', this.type)
        fetch(url, {
          method: 'POST',
          body: form
        }).then(resp => {
          return resp.json()
        }).then(json => {
          console.log(json)
          this.clients.push({
            id: json.client_id,
            name: this.client,
            tel: this.phone,
            doc: this.doc,
            type: this.type,
            status: "Ativo"

          })
        })
      }

    },
    editItem(item) {
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log(this.editedItem);

      this.dialog = true
    },
    close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

  }
}
</script>

<style>
</style>