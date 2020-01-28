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
      <v-container fluid>
        <v-tabs background-color="white" color="deep-purple accent-4" left>
          <v-tab>Parcelas</v-tab>
          <v-tab>Novo Emprestimo</v-tab>
          <v-tab>Abstract</v-tab>
          <v-tab-item>
            <div fluid>
              <v-data-table :headers="headers" :items="listParcel" :search="search">
                <template v-slot:item.status="{ item }">
                  <v-chip x-small :color="getColor(item.status)" dark>{{ item.status}}</v-chip>
                </template>
              </v-data-table>
            </div>
          </v-tab-item>
          <v-tab-item>
            <v-row>
              <div class="col-sm-4">
                <v-card flat class="pa-4">
                  <div class="mb-2">Novo Emprestimo</div>
                  <v-autocomplete
                    class="mb-5"
                    v-model="idClient"
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
                      v-model="planValue"
                      dense
                      :items="plans"
                      label="Selecione plano"
                      outlined
                      item-text="value"
                      item-value="id"
                    ></v-select>
                  </div>
                  <div class>
                    <div class="mb-2">Quantidade de parcelas</div>
                    <v-radio-group v-model="quantityParcel" class="d-flex justify-space-between">
                      <v-radio color="primary" value="11" label="11 vezes"></v-radio>
                      <v-radio color="primary" value="24" label="24 vezes"></v-radio>
                    </v-radio-group>
                  </div>
                  <div class>
                    <div class="mb-2">Cobrar finais de semana</div>
                    <div class="d-flex justify-space-between">
                      <v-checkbox color="primary" label="Sábado" v-model="daysValue" value="1"></v-checkbox>
                      <v-checkbox color="primary" label="Domingo" v-model="daysValue" value="2"></v-checkbox>
                    </div>
                  </div>
                  <v-btn block color="primary" @click="getInstallments()" dark>Confirmar</v-btn>
                </v-card>
              </div>
              <div class="col-sm-6">
                <div class="mb-2">Contratos</div>
              </div>
            </v-row>
          </v-tab-item>
        </v-tabs>
      </v-container>
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
    this.listAllPlans()


  },
  data() {
    return {
      planId: [],
      plan: '',
      quantityParcel: "",
      planValue: 154114,
      daysValue: [],
      row: null,
    
      items: [],
      idClient: "",
      search: null,
      tab: null,
      parcel: [],
      installments: [],
      interval: {},
      value: 0,
      plans: [],
      tabs: null,
      Buscar: '',
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
        // console.log(json)
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
    listAllPlans() {
      const url = `${vars.host}planController.php`
      let formData = new FormData()
      formData.append('all-plans', 'true')
      fetch(url, {
        method: 'POST',
        body: formData
      }).then(resp => {
        return resp.json()
      }).then(json => {
        this.planId = json
        // let element = []
        // json.forEach(element => {
        //   this.plans.push(element.value);
        // });
        // json.forEach(element => {
        //   this.planId.push(element.id);
        // });
        this.plans = json
        console.log(this.planId)

      })
    },
    getInstallments() {
 this.valortotal = localStorage.getItem('total')
      let today = new Date();
      let d = today.getDate() + 1
      let m = today.getMonth()
      let y = today.getFullYear()
      let obj = []
      let verificar = []
      let curdate = []
      let number = 1
      const par = localStorage.getItem('plano')
      let localplan = localStorage.getItem('radios')
      let arrayPlan = localplan.split('-', 2);
      this.valor = arrayPlan[0]
      this.quantidadeparcela = arrayPlan[1]
      let cobrar = localStorage.getItem('checkedNames') || ''
      for (let i = 0; i < arrayPlan[1]; i++) {
        let date = new Date(y, m, d + i)
        let array
        let dataStr = date.toString()
        if (dataStr.indexOf('Sat') < 0) {
          array = [this.valor, date.toLocaleDateString('pt-br'), number, 'cobrar']
        }
        if (dataStr.indexOf('Sun') < 0) {
          array = [this.valor, date.toLocaleDateString('pt-br'), number, 'cobrar']
        }
        if (cobrar.indexOf('1') < 0 && dataStr.indexOf('Sat') >= 0) {
          array = [this.valor, date.toLocaleDateString('pt-br'), number, 'não-cobrar']
          arrayPlan[1]++
          number--
        }
        if (cobrar.indexOf('2') < 0 && dataStr.indexOf('Sun') >= 0) {
          array = [this.valor, date.toLocaleDateString('pt-br'), number, 'não-cobrar']
          arrayPlan[1]++
          number--
        }
        verificar.push(array)
        if (array[3] === 'cobrar')
          obj.push(array)
        number++
      }
      console.log(verificar)
      // console.log(obj)
      this.installments = obj;
    },
  },
  watch: {
    model(val) {
      if (val != null) this.tab = 0
      else this.tab = null
    },
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return
      this.isLoading = true
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
          this.items.push(item)
        })
        // console.log(this.items)
      })
        .finally(() => (this.isLoading = false))
    },
  },
}
</script>

<style>
</style>