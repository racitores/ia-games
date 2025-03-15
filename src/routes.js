// Este archivo se generará automáticamente mediante tu pipeline CI/CD

// IMPORTANTE: No modifiques este archivo manualmente, se generará automáticamente
// basado en el contenido del directorio /src/apps

const routes = [
    {
      path: "/Compatibility",
      name: "Calculadora de compatibilidad",
      description: "Calcula la compatibilidad entre dos nombres",
      component: require('./apps/compatibility').default
    },
    // Aquí se añadirán automáticamente más rutas cuando añadas nuevas aplicaciones
  ];
  
  export default routes;