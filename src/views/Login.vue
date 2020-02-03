<template>
  <div>
    <v-app id="inspire">
      <v-content class="isnpire-gradient">
        <v-container class="fill-height" fluid>
          <v-col cols="12" sm="8" md="4">
            <v-row align="center" justify="center">
              <v-card class="pa-3" flat light>
                <div class="mb-5">
                  <div cols="12" sm="8" md="4" class="mt-5 d-flex justify-center">
                    <img class="mr-2" src="../assets/logo.png" alt width="10%" height="10%" />
                    <h2 class="vedas-text">Vedas</h2>
                  </div>
                </div>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      dense
                      label="Login"
                      name="E-mail"
                      prepend-icon="mdi-account-outline"
                      type="text"
                      outlined
                    />
                    <v-text-field
                      dense
                      id="password"
                      label="Senha"
                      name="password"
                      prepend-icon="mdi-account-lock"
                      type="password"
                      outlined
                    />
                  </v-form>
                </v-card-text>
                <v-btn block color="primary" class="mb-2" dark>Login</v-btn>
                <v-spacer></v-spacer>
                <v-btn block outlined color="primary" dark>Login</v-btn>
              </v-card>
              <v-layout class="card-image pa-5"></v-layout>
            </v-row>
          </v-col>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.isnpire-gradient {
  background: linear-gradient(135deg, #13f1fc 0%, #0470dc 100%);
}
.card-image {
  background-image: url(../assets/vedas.webp);
  background-position: center;
  background-size: cover;
  height: 350px;
}
</style>