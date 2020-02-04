<template>
  <div id="white">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template>
          <v-list-item to="/home" color="primary">
            <v-list-item-action>
              <v-icon>mdi-view-dashboard-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="clients" color="primary">
            <v-list-item-action>
              <v-icon>mdi-account-multiple-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Clientes</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="boxes" color="primary">
            <v-list-item-action>
              <v-icon>mdi-animation-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Caixas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="contract" color="primary">
            <v-list-item-action>
              <v-icon>mdi-note-multiple-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Contratos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="users" color="primary">
            <v-list-item-action>
              <v-icon>mdi-clipboard-account-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Usuarios</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      dense
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue lighten-1"
      flat
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down text-white">Cubo Painel</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon large>
        <v-avatar size="32px" item>
          <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify" />
        </v-avatar>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>

export default {
  name: "Menu",
  props: {
    source: String,
  },
  data: () => ({
    dialog: false,
    drawer: true,
    items: [
      { icon: 'mdi-contacts', text: 'Clientes', router: 'clients' },
      { icon: 'mdi-history', text: 'Caixas', router: 'caixas' },
      { icon: 'mdi-content-copy', text: 'Parcelas', router: 'relatorio' },
      { icon: 'mdi-settings', text: 'Configurações', },
      { icon: 'mdi-help-circle', text: 'Ajuda' },
    ],

  }),
}
</script>