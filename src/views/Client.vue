<template>
  <div>
    <Menu />
    <v-content white fluid>
      <div>
        <v-layout class="col-sm-12 d-flex justify-space-between">
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4 mr-2" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md3>
            <v-card class="pa-4" outlined>
              <div class="overline mb-2">Cliente</div>
              <div class="title blue--text text-capitalize">1314414</div>
            </v-card>
          </v-flex>
        </v-layout>
        <ListClient class="col-sm-12" />
      </div>
    </v-content>
  </div>
</template>

<script>
import ListClient from '../components/ListClient';
import Menu from '../components/Menu';
export default {
  components: {
    ListClient,
    Menu,
  },
  props: {
  },
  data: () => ({

  }),
}
</script>

<style>
</style>