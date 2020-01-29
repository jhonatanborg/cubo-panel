<template>
  <div>
      <Menu/>
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
  },
   data: () => ({
    date: new Date().toISOString().substr(0, 7),
    menu: false,
    modal: false,
    menu2: false,
    boxId: 20,
    listContracts: []
  }),
  methods:{
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
        console.log(this.listContracts)
        // document.getElementById('resp').innerHTML = json
      })
    }
  }
}
</script>

<style>

</style>    