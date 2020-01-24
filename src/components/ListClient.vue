<template>
  <div>
    <v-card class>
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
    <v-dialog v-model="dialog" fullscreen max-width="600px" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dense app dark color="primary">
          <v-toolbar-title>Cliente</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close()">
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
              <v-flex xs12 sm6 md3>
                 <v-alert
                  icon="mdi-firework"
                  border="left"
                  color="indigo"
                  dark
                >I'm an alert with a border left type info</v-alert>
              </v-flex>
              <v-flex xs12 sm6 md3>
                 <v-alert
                  icon="mdi-firework"
                  border="left"
                  color="indigo"
                  dark
                >I'm an alert with a border left type info</v-alert>
              </v-flex>
              <v-flex xs12 sm6 md3>
                  <v-alert
                  icon="mdi-firework"
                  border="left"
                  color="indigo"
                  dark
                >I'm an alert with a border left type info</v-alert>
              </v-flex>
              <v-flex xs12 sm6 md3>
                <v-alert
                  icon="mdi-firework"
                  border="left"
                  color="indigo"
                  dark
                >I'm an alert with a border left type info</v-alert>
              </v-flex>
            </v-layout>
          </div>
          <v-spacer></v-spacer>
          <v-row>
            <div class="form-1 col-sm-6">
              <div class="mt-5">
                <div>Dados Pessais</div>
                <v-divider dense></v-divider>
              </div>
              <v-row>
                <v-col cols="8" sm="6">
                  <v-text-field dense v-model="editedItem.name" outlined label="Cliente" required></v-text-field>
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
                    :items="['Jurídica', 'Física']"
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
                    :items="['Centro', 'Cidade nova', 'Residencial Sul', 'Residencial Sul']"
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
            </div>
            <div class="form-2 col-sm-6">
              <div class="mt-5">
                <div>Dados Pessais</div>
                <v-divider dense></v-divider>
              </div>
              <v-row>
                <v-col cols="8" sm="6">
                  <v-text-field dense v-model="editedItem.name" outlined label="Cliente" required></v-text-field>
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
                    :items="['Jurídica', 'Física']"
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
                    :items="['Centro', 'Cidade nova', 'Residencial Sul', 'Residencial Sul']"
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
            </div>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="red" text @click="close()">Fechar</v-btn>
            <v-btn color="primary" @click="registerClient()">Salvar</v-btn>
          </v-card-actions>
        </div>
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
    this.dataClient()
  },
  data: () => ({
    dialog: false,
    search: '',
    clientStatus: false,
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
    editedItem: {
      id: '',
      name: '',
      doc: '',
      type: '',
      tel: '',
      status: '',
      adress: {
        street: "",
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
      tel: '',
      adress: {
        street: '',
        district: "",
        number: "",
        cep: "",
        complement: "",
      },
    },
    editClient: false,

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
      dataClient() {
      const url = `${vars.host}contractController.php`
      let formData = new FormData()
      formData.append('all-contracts', 'true')
      formData.append('client-id', 9)
      fetch(url, {
        method: 'POST',
        body: formData
      }).then(resp => {
        return resp.json()
      }).then(json => {
        console.log(json);
        
      })
    },
    registerClient() {
      if (this.editClient == true) {
        let form = new FormData()
        form.append('edit-client', 'true')
        form.append('id', this.editedItem.id)
        form.append('name', this.editedItem.name)
        form.append('tel', this.editedItem.tel)
        form.append('doc', this.editedItem.doc)
        form.append('status', this.editedItem.status)
        form.append('type', this.editedItem.type)
        form.append('street', this.editedItem.adress.street)
        form.append('district', this.editedItem.adress.district)
        form.append('complement', this.editedItem.adress.complement)
        form.append('number', this.editedItem.adress.number)
        form.append('cep', this.editedItem.adress.cep)
        fetch(url, {
          method: 'POST',
          body: form
        }).then(resp => {
          return resp.json()
        }).then(json => {
          console.log(json)
          this.dialog = false
        })
      }
      else {
        let form = new FormData()
        form.append('register-client', 'true')
        form.append('street', this.editedItem.address)
        form.append('district', this.editedItem.district)
        form.append('number', this.editedItem.number)
        form.append('cep', this.editedItem.cep)
        form.append('complement', this.editedItem.complement)
        form.append('name', this.editedItem.name)
        form.append('doc', this.editedItem.doc)
        form.append('tel', this.editedItem.tel)
        form.append('type', this.editedItem.type)
        form.append('status', "Ativo")
        fetch(url, {
          method: 'POST',
          body: form
        }).then(resp => {
          return resp.json()
        }).then(json => {
          console.log(json.client_id)
          this.clients.push({
            id: json.client_id,
            name: this.editedItem.name,
            doc: this.editedItem.doc,
            type: this.editedItem.type,
            tel: this.editedItem.tel,
            status: "Ativo",
            adress: {
              street: this.adress.street,
              district: this.adress.district,
              number: this.adress.number,
              cep: this.adress.cep,
              complement: this.adress.complement,
            },
          })
          console.log(this.idNumber)
        })
      }
    },

    regist() {
      console.log(this.editedItem);
    },
    editItem(item) {
      this.editClient = true
      this.editedIndex = this.clients.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log(this.editedItem);
      this.dialog = true
    },
    close() {
      this.editClient = false
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
      console.log(this.editItem);

    },

  }
}
</script>

<style>
</style>