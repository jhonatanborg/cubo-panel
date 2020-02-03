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
            :items="users"
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
      </v-container>
      <v-layout row justify-center>
        <v-dialog v-model="userDialog" persistent max-width="400px">
          <v-card flat>
            <v-toolbar dense flat dark color="primary">
              <v-toolbar-title>Editar Usuário</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn @click="userDialog = false" icon dark>
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
              <v-alert v-if="succesAlert" dense text type="info" dismissible>{{msg}}</v-alert>
              <v-alert v-if="errorAlert" dense text type="error" dismissible>{{msg}}</v-alert>
              <div class="d-flex justify-end mb-5">
                <v-chip :color="getColor(userEdit.status)" small dark>
                  <b>{{userEdit.status}}</b>
                </v-chip>
                <v-spacer></v-spacer>
                <v-btn @click="editStatus()" small outlined color="primary">Alterar</v-btn>
              </div>
              <v-text-field
                v-model="userEdit.name"
                dense
                outlined
                label="Nome"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="userEdit.email"
                dense
                outlined
                label="E-mail"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="userEdit.tel"
                dense
                outlined
                label="Telefone"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="userEdit.pass"
                dense
                outlined
                label="Senha"
                type="text"
                required
              ></v-text-field>
              <v-select
                dense
                outlined
                label="Nível"
                type="text"
                required
                :items="items"
                v-model="userEdit.level"
              ></v-select>
              <v-btn @click="EditUserSend()" block color="primary">Confirmar</v-btn>
            </div>
          </v-card>
        </v-dialog>
        <v-dialog v-model="userInsert" persistent max-width="400px">
          <v-card flat>
            <v-toolbar dense flat dark color="primary">
              <v-toolbar-title>Novo Usuário</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn @click="userInsert = false" icon dark>
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
              <v-text-field
                v-model="userObject.name"
                dense
                outlined
                label="Nome"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="userObject.email"
                dense
                outlined
                label="E-mail"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="userObject.tel"
                dense
                outlined
                label="Telefone"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="userObject.pass"
                dense
                outlined
                label="Senha"
                type="text"
                required
              ></v-text-field>
              <v-select
                dense
                outlined
                label="Nível"
                type="text"
                required
                :items="items"
                v-model="userObject.level"
              ></v-select>
              <v-btn @click="registerUser()" block color="primary">Confirmar</v-btn>
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
const url = `${vars.host}userController.php`

export default {
  components: {
    Menu,
  },
  mounted: function () {
    this.getUsers()
  },
  data() {
    return {
      userInsert: false,
      userDialog: false,
      editedIndex: -1,
      succesAlert: false,
      errorAlert: false,
      msg: '',
      loading: false,
      items: ['Administrador', 'Colaborador'],
      search: '',
      loading: false,
      users: [],
      headers: [
        { text: 'ID', value: 'id' },
        {
          text: 'Nome',
          align: 'left',
          sortable: true,
          value: 'name',
        },
        { text: 'Telefone', value: 'tel' },
        { text: 'Nível', value: 'level' },
        { text: 'Status', value: 'status' },
        { text: 'Ações', value: 'acao', sortable: false },

      ],
      userObject: [
        {
          name: '',
          email: '',
          tel: '',
          pass: '',
          level: '',
          status: '',
        }
      ],
      userEdit: [
        {
          name: '',
          email: '',
          tel: '',
          pass: '',
          level: '',
          status: '',

        }
      ],

      editClient: false,
    }
  },
  methods: {
    editItem(item) {
      //   console.log(item)
      this.editClient = true
      this.userDialog = true
      this.editedIndex = this.users.indexOf(item)
      this.userEdit = Object.assign({}, item)
    },
    EditUserSend() {
      this.loading = true
      let form = new FormData()
      form.append('alter-user', 'true')
      form.append('user-id', this.userEdit.id)
      form.append('user-name', this.userEdit.name)
      form.append('user-email', this.userEdit.email)
      form.append('user-tel', this.userEdit.tel)
      form.append('user-pass', this.userEdit.pass)
      form.append('user-status', this.userEdit.status)
      form.append('user-level', this.userEdit.level)
      fetch(url, {
        method: "POST",
        body: form
      }).then(resp => {
        return resp.json()
      }).then(json => {
        console.log(json)
        if (json.msg.indexOf("sucesso") > 0) {
          this.succesAlert = true;
          // this.$router.push('home')
          this.msg = json.msg
          this.loading = false
          this.errorAlert = false
          this.getUsers()

        } else {
          this.succesAlert = false;
          this.errorAlert = true
          this.msg = json.msg
          this.getUsers()
        }
      })


    },
    registerUser() {
      this.loading = true
      let form = new FormData()
      form.append('register', 'true')
      form.append('name', this.userObject.name)
      form.append('email', this.userObject.email)
      form.append('tel', this.userObject.tel)
      form.append('pass', this.userObject.pass)
      form.append('level', this.userObject.level)
      fetch(url, {
        method: "POST",
        body: form
      }).then(resp => {
        return resp.json()
      }).then(json => {
        console.log(json)
        if (json.msg.indexOf("Sucesso") > 0) {
          this.succesAlert = true;
          this.msg = json.msg
          this.loading = false
          this.getUsers()
        } else {
          this.errorAlert = true
          this.msg = json.msg
          this.getUsers()
        }
      })
    },
    getUsers() {
      const url = `${vars.host}userController.php`
      let form = new FormData()
      form.append('get-users', 'true')
      fetch(url, {
        method: "POST",
        body: form
      }).then(resp => {
        return resp.json()
      }).then(json => {
        console.log(json);
        this.users = json
        // console.log(this.usersActive)
        // console.log(this.usersInactive)
        // document.getElementById('resp').innerHTML = json
      })
    },

    getColor(status) {
      if (status == "Ativo") return 'primary'
      else if (status == "Inativo") return 'red'
      else return 'green'
    },
    close() {
      this.userDialog = false

    },
    editStatus() {
      if (this.userEdit.status == 'Ativo') {
        return this.userEdit.status = 'Inativo'
      } else if (this.userEdit.status == 'Inativo') {
        return this.userEdit.status = 'Ativo'
      }
    },
  },
  watch: {
    loading(val) {
      if (!val) return

      setTimeout(() => (this.loading = false), 3000)
    },

  }
}
</script>

<style>
</style>