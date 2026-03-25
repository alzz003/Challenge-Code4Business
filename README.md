#  Mini Sales App con IA - Technical Challenge

Este proyecto es una aplicación Web Full Stack diseñada para gestionar y evaluar ventas de forma simplificada. Desarrollada como parte de la evaluación técnica para la posición de **AI Engineer**, con un enfoque en la integración eficiente de herramientas de IA y criterio técnico.

##  Características Principales
- **Listado de Ventas:** Visualización clara en tiempo real.
- **Formulario en Modal:** Interfaz limpia (UX) para la creación de registros sin recargas de página.
- **Evaluación de Ventas:** Sistema de puntuación (1-5 estrellas) con actualización inmediata.
- **Dark Mode Nativo:** Interfaz diseñada para reducir la fatiga visual.
- **Indicadores de Desempeño:** Cálculo automático del promedio de scores.

##  Stack Tecnológico
- **Frontend:** [Next.js 14+](https://nextjs.org/) con App Router y Tailwind CSS.
- **Backend:** [Node.js](https://nodejs.org/) con Express.
- **Base de Datos:** SQLite (persistente en el contenedor).
- **Contenedores:** Docker & Docker Compose.

##  Enfoque de AI Engineering
Este proyecto fue desarrollado utilizando un flujo de trabajo asistido por IA (Gemini 3.1 PRO y 3 Flash):

1.  **Arquitectura:** Generación de la estructura base del backend y configuración de Docker.
2.  **Ajustes Manuales (Puntos Clave):**
    *   **Validación Custom:** Se reemplazaron las validaciones nativas de HTML5 por lógica de estado en React para ofrecer mensajes de error personalizados.
    *   **Refactorización UI:** Implementación manual de un componente Modal y un tema oscuro consistente para cumplir con los requerimientos de "Pantallas mínimas" y estética profesional.
    *   **Docker Optimization:** Configuración de contenedores ligeros (`alpine`) para despliegues rápidos.

##  Cómo ejecutar el proyecto
La aplicación está totalmente dockerizada para asegurar que corra en cualquier entorno con un solo comando:

```bash
docker compose up --build
```
Una vez finalizado el proceso, la app estará disponible en:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001](http://localhost:3001)

---

**Desarrollado por Lucas Alzugaray**  
*Candidato a AI Engineer*
