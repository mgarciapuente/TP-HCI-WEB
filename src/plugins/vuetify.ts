import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#465D46',
          secondary: '#465D46',
          surface: '#D1D1D1',
          background: '#F5F5F5',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          buttons: '#FCFBF8',
          titles: '#333333',
        },
      },
    },
  },
})