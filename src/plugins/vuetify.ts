import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#465D46',
          secondary: '#F5844E',
          surface: 'rgba(237, 241, 239, 1)7',
          background: '#F5F5F5',
          backgroundColor: '#EBEEEB',
          buttons: '#FCFBF8',
          titles: '#333333',
        },
      },
    },
  },
})