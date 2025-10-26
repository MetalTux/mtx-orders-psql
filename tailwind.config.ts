module.exports = {
  darkMode: 'media', // Automático según preferencia del usuario
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', 'Roboto', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        /*primary: '#2563eb',   // Azul principal
        secondary: '#1e293b', // Gris oscuro
        accent: '#22c55e',    // Verde acento
        warning: '#f59e42',   // Naranja acento
        background: '#f8fafc',// Fondo claro
        */
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        background: 'var(--color-bg-main)',
      },
    },
  },
  plugins: [],
}
