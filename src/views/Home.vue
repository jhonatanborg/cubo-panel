<template>
  <v-content white fluid>
    <Menu />
    <div>
      <div class="col-sm-12">
        <div class text-lg-left>Resumo</div>
        <v-divider class="pt-2"></v-divider>
        <v-layout class="d-flex justify-space-between">
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div>
      <div class="col-sm-12">
        <v-card flat >
          <div class="pa-4 d-flex justify-space-between">
            <v-btn depressed small color="primary">Novo Emprestimo</v-btn>
            <v-btn depressed small color="primary">Novo Emprestimo</v-btn>
          </div>
        </v-card>
      </div>
    </div>
    <div>
      <v-layout class="col-sm-12">
        <v-card flat  color="white" class="col-sm-12">
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify "
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="listParcel" :search="search">
            <template v-slot:item.status="{ item }">
              <v-chip x-small :color="getColor(item.status)" dark>{{ item.status}}</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-layout>
    </div>
  </v-content>
</template>
<script>
import vars from '../plugins/env.local'
import Menu from '../components/Menu';
export default {
  components: {
    Menu,
  },
  mounted: function () {
    // `this` points to the vm instance
    this.unsuccessful()
    this.installmentsAll()
  },
  data() {
    return {
      search: '',
      listParcel: [],
      headers: [
        {
          text: 'Parcela-id',
          align: 'left',
          value: 'id',
        },
        { text: 'Cliente', value: 'client.name' },
        { text: 'Vencimento', value: 'date' },
        { text: 'Status', value: 'status' },

      ],
    }
  },
  methods: {
    unsuccessful() {
      const url = `${vars.host}parcelController.php`
      let formData = new FormData()
      formData.append('unsuccessful', 'true')
      fetch(url, {
        method: 'POST',
        body: formData
      }).then(resp => {
        return resp.json()
      }).then(json => {
        console.log(json)
      })
    },
    installmentsAll() {
      this.isLoading = true
      const url = `${vars.host}parcelController.php`
      let formData = new FormData()
      formData.append('filter', 'true')
      fetch(url, {
        method: 'POST',
        body: formData
      }).then(resp => {
        return resp.json()
      }).then(json => {
        this.listParcel = json

        console.log(json);

        this.installmentsTotal = json.length
        this.isLoading = false
        let totalVencida = 0
        let totalPendente = 0
        let totalCobrada = 0
        let totalRecebida = 0
        json.forEach(item => {
          // console.log(item)
          switch (item.status) {
            case 'VENCIDA':
              totalVencida += parseFloat(item.value)
              this.quantityDefeat = totalVencida
              break;
            case 'PENDENTE':
              totalPendente += parseFloat(item.value)
              this.quantityPending = totalPendente
              break;
            case 'COBRADO':
              totalCobrada += parseFloat(item.value)
              break;
            case 'RECEBIDA':
              totalRecebida += parseFloat(item.value)
              this.quantityReceive = totalRecebida
              break;
            default:
              break;
          }
        })
        // console.log(`Total vencidas: ${totalVencida}`)
        // console.log(`Total pendetes: ${totalPendente}`)
        // console.log(`Total cobradas: ${totalCobrada}`)
        // console.log(`Total recebidas: ${totalRecebida}`)
      })
    },
    getColor(status) {


      switch (status) {
        case "VENCIDA":
          return "red"
          break;
        case "COBRADO":
          return "purple darken-3"
          break;
        case "RECEBIDA":
          return "primary"
          break;
        case "PENDENTE":
          return "amber"
          break;
        default:
          break;
      }
    },
  },
}
</script>

<style>
</style>