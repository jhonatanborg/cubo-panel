<template>
  <div>
    <v-app id="inspire">
      <v-content class="isnpire-gradient">
        <v-container class="fill-height" fluid>
          <v-col cols="12" sm="8" md="12">
            <v-row class="pa-5" align="center" justify="center">
              <v-card min-width="400px" class="pa-5" flat light>
                <div class="mb-5">
                  <div cols="12" sm="8" md="8" class="mt-5 d-flex justify-center">
                    <img class="mr-2" src="../assets/logo.png" alt width="10%" height="10%" />
                    <div class="display-1 vedas-text">
                      <b>Vedas</b>
                    </div>
                  </div>
                </div>
                <v-card-text>
                  <v-text-field v-model="user" dense label="Login" type="e-mail" outlined />
                  <v-text-field dense v-model="pass" label="Senha" type="password" outlined />
                  <v-alert v-show="erroLogin" type="error" :value="true" dense outlined>
                    <div class="subtitle">{{msg}}</div>
                  </v-alert>
                  <v-btn
                    :loading="loading"
                    :disabled="loading"
                    color="blue"
                    block
                    dark
                    class="mb-2"
                    @click="login()"
                  >
                    <div color="white">Login</div>
                  </v-btn>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <div align="center" justify="center">
                  <v-chip x-small color="blue" text-color="white" dark>www.vedassistemas.com.br</v-chip>
                </div>
              </v-card>
            </v-row>
          </v-col>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import vars from '../plugins/env.local'
const url = `${vars.host}userController.php`
export default {
  mounted: function () {
    // this.verifyLogin()
  },
  data() {
    return {
      loader: null,
      loading: false,
      user: '',
      pass: '',
      erroLogin: false,
      msg: "",
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 3000)

      this.loader = null
    },
  },
  methods: {

    login() {
      this.loader = 'loading'
      let form = new FormData()
      form.append('login', true)
      form.append('email', this.user)
      form.append('pass', this.pass)
      fetch(url, {
        method: "POST",
        body: form
      }).then(resp => {
        return resp.json()
      }).then(json => {
        if (json.status === 'Ativo') {
          localStorage.setItem('user-name', json.name)
          localStorage.setItem('user-id', json.userId)
          localStorage.setItem('boxStatus', json.box_status[1])
          localStorage.setItem('boxId', json.box_status[0])
          localStorage.setItem('level', json.level)
          this.$router.push('home')
        } else {
          this.erroLogin = true
          this.msg = json.msg
          this.loader = null
        }
      })

    }
  },

}
</script>

<style>
.isnpire-gradient {
  background: linear-gradient(135deg, #13f1fc 0%, #0470dc 100%);
}

.vedas-text {
  color: #02205f;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>