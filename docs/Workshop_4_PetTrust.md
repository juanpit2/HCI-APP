# Workshop 4 – Concept Selection + "Concept Test Sprint"
## Proyecto: PetTrust — Plataforma de Paseos de Mascotas con Rastreo en Tiempo Real e IA

**Equipo:** [Nombres del equipo]  
**Fecha:** 2 de mayo de 2026  
**Curso:** [Nombre del curso]

---

## Objetivo del Workshop

Seleccionar **una dirección tecnológica emergente** que genuinamente mejore nuestro problema identificado, validarla mediante un **prototipo interactivo funcional**, ejecutar una **prueba de usabilidad rápida** con usuarios reales, y realizar un **chequeo de responsabilidad** (HCI, Accesibilidad, Ética/Privacidad).

---

# Actividad 1: Matchmaking (Problem ↔ Tech)

## 1.1 Re-statement del Problema (una oración)

> **Dueños de mascotas** en contextos urbanos (Cali, Colombia) **necesitan delegar el paseo de sus perros** a cuidadores verificados, pero **carecen de visibilidad en tiempo real** sobre la ubicación, el recorrido y el bienestar de su mascota durante el paseo, lo que genera **desconfianza y ansiedad**.

**Formato:** Usuario + Contexto + Meta + Restricción  
- **Usuario:** Dueños de mascotas urbanas  
- **Contexto:** Ciudades medianas/grandes con estilos de vida ocupados  
- **Meta:** Delegar paseos de forma segura y transparente  
- **Restricción:** No hay forma de verificar en tiempo real qué sucede con su mascota

---

## 1.2 Dos Tecnologías Candidatas

De la tabla ETL (Emerging Technology Landscape) de la clase, seleccionamos las siguientes dos candidatas:

| | **Opción A: IA Generativa (Gemini/LLM)** | **Opción B: IoT + GPS en Tiempo Real** |
|---|---|---|
| **Descripción** | Motor de IA que analiza compatibilidad paseador-perro, sugiere rutas óptimas, y genera reportes post-paseo automáticos. | Dispositivo GPS con sensores IoT (collar inteligente) que transmite ubicación, ritmo cardíaco y actividad del perro en tiempo real. |
| **Ejemplo de uso** | El paseador pregunta "Busco paseos por el Parque del Perro" y la IA le responde con tarjetas interactivas de perros compatibles, sugiriendo rutas seguras. | El dueño abre la app y ve un mapa en vivo con la posición exacta del perro, su frecuencia cardíaca, y la ruta que está recorriendo el paseador. |

---

## 1.3 Scoring Matrix (1–5)

| Criterio | **Opción A: IA Generativa** | **Opción B: IoT + GPS** |
|---|:---:|:---:|
| **User Value** (¿Reduce fricción / mejora el resultado?) | ⭐⭐⭐⭐⭐ (5) — La IA elimina la fricción de buscar perros manualmente, sugiere rutas inteligentes, y genera insights automáticos de compatibilidad. | ⭐⭐⭐⭐ (4) — Aporta gran valor en transparencia y seguridad, pero depende de hardware externo que el usuario debe tener. |
| **Prototype Feasibility** (¿Se puede construir un demo en 2 semanas?) | ⭐⭐⭐⭐⭐ (5) — API de Google Gemini accesible, integración directa en React Native, sin hardware adicional. Ya implementado. | ⭐⭐⭐ (3) — Requiere hardware real (collar GPS), protocolos MQTT/BLE, y un servidor para procesar streams. Complejo de simular. |
| **Responsibility Risk** (Accesibilidad + ética/privacidad + inclusión) | ⭐⭐⭐⭐ (4) — Riesgo moderado: la IA podría generar recomendaciones sesgadas, pero es auditable y controlable por prompts. No recolecta datos biométricos. | ⭐⭐⭐ (3) — Riesgo alto: recolecta datos de ubicación en tiempo real de personas y animales. Requiere políticas de retención de datos y consentimiento explícito. |
| **TOTAL** | **14/15** | **10/15** |

---

## 1.4 Decision Card — Tecnología Elegida

> ### ✅ Tecnología Elegida: **IA Generativa (Google Gemini)**
>
> **Justificación (2–3 oraciones):**  
> Elegimos IA Generativa porque maximiza el valor para ambos usuarios (dueños y paseadores) al automatizar la búsqueda de paseos compatibles, sugerir rutas óptimas, y generar reportes inteligentes post-paseo, todo sin requerir hardware adicional. Su factibilidad es inmediata: la API de Google Gemini se integra directamente en nuestra app React Native/Expo, y ya tenemos un prototipo funcional que demuestra el chat interactivo con tarjetas de recomendación. Además, el riesgo de responsabilidad es menor que IoT ya que no recolectamos datos biométricos continuos.

**Nota:** Aunque elegimos IA como tecnología primaria, **complementamos con geolocalización nativa del dispositivo** (GPS del celular) para el rastreo de paseos, evitando la necesidad de hardware IoT externo.

---

# Actividad 2: Low-Fi Testable Prototype

## 2.1 Formato del Prototipo

**Formato elegido:** Clickable Low-Fi → evolucionado a **Prototipo funcional interactivo** (React Native + Expo)

Nuestro prototipo va más allá de paper prototyping: es una **aplicación mobile funcional** construida con React Native y Expo que se puede ejecutar en cualquier teléfono escaneando un código QR, sin necesidad de instalar nada desde un repositorio.

> **⚠️ Nota importante:** PetTrust tiene **dos vistas/roles** dentro de la misma app. Desde el Login, el usuario elige "Soy Dueño" o "Soy Cuidador", y la interfaz se adapta completamente. Por lo tanto, existen **dos Happy Paths** independientes que cubren los flujos críticos de cada rol.

---

## 2.2 Happy Path A: Vista del Paseador (Cuidador)

**Tarea:** *"Como paseador, quiero encontrar un perro para pasear, aceptar la solicitud, recoger al perro, hacer el paseo y finalizarlo."*

| Paso | Estado Inicial | Interacción | Feedback del Sistema | Estado Final |
|:---:|---|---|---|---|
| 1 | Login Screen (Milo + botón Explore) | Tap "Explore" → Tap "Soy Cuidador" | Animación de transición al dashboard | Home (Walker) |
| 2 | Home (Saludo + Banner IA) | Tap banner IA o navegar a Explorar | Mapa interactivo con marcadores de perros | ExploreScreen |
| 3 | ExploreScreen (Bottom Sheet) | Tap "Solicitar paseo" | Modal de éxito: "¡Solicitud Enviada!" + botón "Ir a Actividad" | ActivityScreen |
| 4 | ActivityScreen (Pendientes) | Tap "✓ Aceptar" solicitud | Tarjeta se mueve a "Aceptados - Listo para recoger" | Sección Aceptados |
| 5 | ActivityScreen (Aceptados) | Tap "Ir a recoger mascota" | Mapa abre FASE 1: Ruta azul al punto de recogida | LiveTracking (Pickup) |
| 6 | LiveTracking (Pickup) | Tap "✓ Marcar recogida - Iniciar paseo" | Mapa cambia FASE 2: Ruta morada + instrucciones Waze | LiveTracking (Walk) |
| 7 | LiveTracking (Walk) | (Opcional) Tap 💬 chatear con dueño | Modal de chat en tiempo real | Chat activo |
| 8 | LiveTracking (100%) | Tap "Finalizar Paseo" | Transición a resumen | WalkSummaryScreen |
| 9 | WalkSummary | Calificar ⭐ + comentario → "Enviar" | Feedback guardado, navegación a inicio | Home (éxito) |

---

## 2.3 Happy Path B: Vista del Dueño

**Tarea:** *"Como dueño, quiero solicitar un paseo para mi perro, asignar una ruta, y ver en tiempo real cómo va el paseo."*

| Paso | Estado Inicial | Interacción | Feedback del Sistema | Estado Final |
|:---:|---|---|---|---|
| 1 | Login Screen | Tap "Explore" → Tap "Soy Dueño" | Transición al dashboard del dueño | Home (Owner) |
| 2 | Home (Mis mascotas) | Tap "Agendar paseo" en un perro | Formulario de programación de paseo | ScheduleWalkScreen |
| 3 | ScheduleWalk | Elige fecha, hora, duración y ruta (con sugerencias IA) | IA sugiere rutas con zonas verdes | Solicitud configurada |
| 4 | ScheduleWalk | Tap "Confirmar solicitud" | Animación de confirmación + estado "Buscando paseador..." | WalkStatusScreen |
| 5 | WalkStatus (Esperando) | Espera (simulada ~5s) | Notificación: "¡Un paseador aceptó tu solicitud!" + info del paseador | Estado Aceptado |
| 6 | WalkStatus (Aceptado) | (Automático) El paseador inicia recogida | Mapa en vivo: posición del paseador acercándose | LiveTracking (Owner view) |
| 7 | LiveTracking (Owner) | Observa el mapa + Tap 💬 para chatear | Chat con el paseador: "Ya voy llegando" | Chat activo |
| 8 | LiveTracking (Owner) | Observa el progreso del paseo | Barra de progreso avanzando + ruta en el mapa | Paseo en curso |
| 9 | WalkSummary (Owner) | Ve resumen → Califica al paseador | Estadísticas del paseo guardadas | Home (éxito) |

---

## 2.4 Screenshots del Prototipo

> **Nota:** Las capturas de pantalla del prototipo funcional se adjuntan como evidencia fotográfica por separado. El prototipo se ejecuta en tiempo real escaneando el QR de Expo Go.

**Pantallas implementadas (compartidas + específicas por rol):**

| # | Pantalla | Rol | Descripción |
|---|---|---|---|
| 1 | `LoginScreen` | Ambos | Foto de Milo en círculo morado, botón "Explore" → revela "Soy Dueño" / "Soy Cuidador" |
| 2 | `HomeScreen` | Adaptativa | **Walker:** Banner IA, carrusel urgencias, recomendaciones / **Owner:** Mis mascotas, agendar paseo |
| 3 | `ExploreScreen` | Walker | Mapa Google pantalla completa, marcadores de perros, Bottom Sheet, botón IA |
| 4 | `AIFindWalkScreen` | Walker | Chat con Gemini con **tarjetas interactivas** (foto + "Ver en Mapa") |
| 5 | `DogProfileScreen` | Ambos | Perfil completo: foto circular, stats, temperamento, vacunas, dueño con contacto |
| 6 | `ScheduleWalkScreen` | Owner | Formulario: fecha, hora, duración, ruta con sugerencias IA |
| 7 | `ActivityScreen` | Walker | Pendientes (ruta/fecha/hora), Aceptados (contacto dueño), Completados |
| 8 | `WalkStatusScreen` | Owner | Estado de solicitud en tiempo real con simulación de aceptación |
| 9 | `LiveTrackingScreen` | Ambos | Mapa Polyline, 2 fases (Pickup → Walk), turn-by-turn, chat dueño↔paseador |
| 10 | `WalkSummaryScreen` | Ambos | Resumen estadístico, mini mapa de ruta, calificación por estrellas |

---

# Actividad 3: Mini Usability Test

## 3.1 Test Setup

| Parámetro | Detalle |
|---|---|
| **Participantes** | 3 compañeros de clase (no del equipo) |
| **Roles del equipo** | **Facilitador:** Lee la tarea, no interviene / **Observador:** Observa comportamiento / **Note-taker:** Captura breakdowns |
| **Dispositivo** | Teléfono con Expo Go instalado, escaneando QR del prototipo |
| **Duración** | ~5 minutos por participante |

## 3.2 Test Script

> **Facilitador dice:**
> 
> 1. *"Imagina que eres un cuidador de perros que usa PetTrust. Acabas de abrir la app por primera vez."*
> 2. *"Tu tarea: **Encuentra un perro cercano a ti para pasear, acepta la solicitud, ve a recogerlo, y finaliza el paseo.**"*
> 3. *(Observar en silencio — NO ayudar ni guiar)*
> 4. Al finalizar, preguntar:
>    - *"¿Qué fue confuso o lento?"*
>    - *"¿Qué cambiarías primero?"*

## 3.3 Resultados: Breakdowns y Fixes

### Top 3 Breakdowns Capturados

| # | Breakdown | Evidencia | Severidad |
|---|---|---|---|
| **BD-1** | **Confusión entre roles en Login:** Al presionar "Explore", los usuarios no entendían inmediatamente la diferencia entre "Soy Dueño" y "Soy Cuidador". Algunos preguntaron "¿Cuál es cuál?". | 2 de 3 participantes dudaron >3 segundos antes de elegir. | Media |
| **BD-2** | **No encontraban el chat de IA fácilmente:** Los usuarios no identificaron el botón flotante "Encontrar paseos con IA" en la pantalla del mapa porque estaba en la parte inferior y competía visualmente con el Bottom Sheet. | 2 de 3 participantes ignoraron el botón IA y buscaron en el menú. | Alta |
| **BD-3** | **El cambio de fase (Pickup → Walk) no era evidente:** Al presionar "Marcar recogida", el cambio del mapa (ruta azul a morada) sucedía sin un feedback visual fuerte. Los usuarios no estaban seguros de que algo había cambiado. | 1 participante presionó el botón dos veces pensando que no funcionó. | Media |

### Top 3 Fixes Propuestos

| # | Fix | Relacionado con | Cambio concreto |
|---|---|---|---|
| **FX-1** | **Agregar descripciones a los botones de rol:** Debajo de "Soy Dueño" agregar "Gestiona los paseos de tus mascotas" y debajo de "Soy Cuidador" agregar "Busca perros para pasear cerca de ti". | BD-1 | Actualizar `LoginScreen.js` con subtexto descriptivo en cada botón. |
| **FX-2** | **Hacer el botón de IA más prominente:** Convertirlo en un FAB (Floating Action Button) con animación de pulso, o integrarlo directamente en la barra de búsqueda como "Buscar con IA ✨". | BD-2 | Rediseñar `ExploreScreen.js` para integrar IA en la barra superior. |
| **FX-3** | **Agregar una transición animada entre fases:** Mostrar un modal intermedio tipo "¡Recogida confirmada! 🎉 Iniciando ruta de paseo..." que dure 2 segundos antes de cambiar el mapa. | BD-3 | Agregar modal de transición en `LiveTrackingScreen.js`. |

### Test Snapshot (Output)

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST SNAPSHOT — PetTrust                     │
├─────────────────────────────────────────────────────────────────┤
│  3 Breakdowns    →    3 Fixes    →    What We'll Change Next   │
│                                                                 │
│  BD-1: Confusión     FX-1: Subtextos     → Sprint 1: Login     │
│        en roles             descriptivos         descriptions   │
│                                                                 │
│  BD-2: Botón IA      FX-2: FAB con       → Sprint 1: Redesign  │
│        invisible           animación            explore search  │
│                                                                 │
│  BD-3: Transición    FX-3: Modal de      → Sprint 2: Add       │
│        de fase sin         confirmación         transition      │
│        feedback            animada              animation       │
└─────────────────────────────────────────────────────────────────┘
```

---

# Actividad 4: Five-Minute Responsibility Check

## A) HCI — Heurísticas de Nielsen (2–3 revisadas)

### 1. Feedback / Visibilidad del Estado del Sistema ✅
**¿El sistema muestra claramente qué está pasando?**

| Elemento | Estado |
|---|---|
| Modal "¡Solicitud Enviada!" después de solicitar un paseo en el mapa | ✅ Implementado — modal con icono de éxito, texto explicativo, y botón "Ir a Actividad" |
| Barra de progreso del paseo en LiveTrackingScreen | ✅ Implementado — barra animada 0%→100% sincronizada con el movimiento del mapa |
| Indicador de carga "Analizando..." en el chat IA | ✅ Implementado — spinner + texto "Buscando paseos..." mientras Gemini procesa |
| Instrucciones Turn-by-Turn en la fase de paseo | ✅ Implementado — tarjeta superior con dirección y distancia tipo Waze |

**Evaluación:** El sistema proporciona feedback consistente en todas las interacciones críticas. El usuario siempre sabe qué está pasando.

### 2. Prevención de Errores ✅
**¿El sistema previene errores fáciles?**

| Elemento | Estado |
|---|---|
| Botón "Enviar" en el chat se deshabilita si el campo está vacío | ✅ Implementado — `disabled={!input.trim()}` |
| No se puede iniciar un paseo sin antes aceptar la solicitud | ✅ Implementado — flujo secuencial obligatorio |
| Confirmación antes de cambiar de fase (Pickup → Walk) | ⚠️ Parcial — el botón cambia directamente sin confirmación (FX-3 planificado) |

**Evaluación:** La prevención de errores es sólida en la mayoría de flujos. La transición de fase es el único punto que necesita una confirmación adicional (ya planificada como FX-3).

### 3. Consistencia y Estándares ✅
**¿Los controles/labels/comportamiento son consistentes?**

| Elemento | Estado |
|---|---|
| Paleta de colores unificada (morado IA, azul primario, verde éxito) | ✅ Consistente en todas las pantallas |
| Estilo de botones (border-radius 20px, padding uniforme) | ✅ Consistente |
| Iconografía de Lucide React Native en toda la app | ✅ Consistente |
| Navegación Bottom Tab con mismos iconos y labels | ✅ Consistente — barra flotante tipo pastilla |

**Evaluación:** La consistencia visual y de interacción es alta gracias al uso de un archivo centralizado de constantes (`theme.js`) y una librería de iconos única.

---

## B) Accesibilidad — POUR (1–2 riesgos)

### 1. Perceivable (Perceptible) ⚠️

**Riesgo identificado:** Las tarjetas de perros en el carrusel horizontal del Home usan texto claro (#999) sobre fondo blanco, lo que podría no cumplir el ratio de contraste mínimo de 4.5:1 para texto pequeño (WCAG AA).

**Mitigación:** En el próximo sprint, ejecutaremos una auditoría de contraste con herramientas como Contrast Checker y ajustaremos los colores de texto secundario (`COLORS.textSecondary`) para garantizar un ratio mínimo de 4.5:1.

### 2. Operable (Operable) ⚠️

**Riesgo identificado:** Los marcadores de perros en el mapa (`ExploreScreen`) son áreas táctiles pequeñas (~30x30px) que podrían ser difíciles de presionar para usuarios con motricidad reducida. La guía de Apple recomienda un mínimo de 44x44 puntos.

**Mitigación:** Incrementar el área táctil de los marcadores del mapa a 48x48px e implementar un `hitSlop` de 10px adicionales en React Native para expandir el área de toque sin afectar el diseño visual.

---

## C) Ética / Privacidad (1–2 risk flags)

### Risk Flag 1: Geolocalización en Tiempo Real 🔴

**¿Estamos recolectando más datos de los necesarios?**

La app rastrea la ubicación en tiempo real del paseador durante todo el paseo. Si bien esto es necesario para la funcionalidad core (transparencia para el dueño), plantea riesgos:
- La ubicación exacta del paseador se transmite continuamente.
- Los datos de ruta se almacenan en el historial.
- Un actor malicioso podría usar el historial de rutas para rastrear patrones de movimiento.

**Mitigación:**
- Implementar **retención temporal**: los datos de ubicación en tiempo real se eliminarán automáticamente 24 horas después de finalizado el paseo.
- Mostrar **solo la ruta general** (puntos clave) en el historial, no la traza completa segundo a segundo.
- Añadir un **toggle** para que el paseador pueda pausar temporalmente el rastreo (con notificación al dueño).
- Comunicar claramente en los **términos de servicio** qué datos se recolectan y por cuánto tiempo.

### Risk Flag 2: Recomendaciones IA y Potencial Sesgo 🟡

**¿Estamos nudging/coercing usuarios hacia choices no en su interés?**

El motor de IA recomienda perros "urgentes" con badges rojos prominentes y los coloca primero en la lista. Esto podría:
- Crear **urgencia artificial** que presione al paseador a elegir un perro con el que no es compatible.
- Sesgar la visibilidad: perros "no urgentes" podrían no recibir nunca atención.

**Mitigación:**
- La etiqueta "Urgente" se basa en un criterio **objetivo y transparente**: días sin pasear > 5. Esto se comunicará visualmente al usuario.
- Mantener la sección de "Recomendaciones" (basada en compatibilidad real) **igual de prominente** que la sección de "Urgencias" para no sesgar la elección.
- Agregar un **disclaimer** visible: "Estas recomendaciones son sugerencias. Tú eliges con quién te sientes cómodo."

---

## Resumen de Responsabilidad (6 bullets)

| Categoría | Bullet | Estado |
|---|---|---|
| **HCI** | ✅ Feedback: Modal de éxito, barra de progreso, indicadores de carga en todas las interacciones críticas. | Cumplido |
| **HCI** | ✅ Prevención de errores: Botones deshabilitados, flujo secuencial obligatorio. Pendiente: confirmación en cambio de fase. | Parcial |
| **HCI** | ✅ Consistencia: Paleta centralizada, iconografía única, navegación estándar. | Cumplido |
| **Accesibilidad** | ⚠️ POUR-Perceivable: Ratio de contraste en textos secundarios debe verificarse. Mitigación: auditoría de contraste en Sprint 2. | Planificado |
| **Accesibilidad** | ⚠️ POUR-Operable: Áreas táctiles de marcadores del mapa < 44pt. Mitigación: expandir hitSlop a 48px. | Planificado |
| **Ética/Privacidad** | 🔴 Geolocalización continua con riesgo de sobre-recolección. Mitigación: retención temporal de 24h + toggle de pausa. | Planificado |

---

# Apéndice: Stack Tecnológico del Prototipo

| Componente | Tecnología |
|---|---|
| **Framework Mobile** | React Native + Expo (SDK 52) |
| **Navegación** | React Navigation (Stack + Bottom Tabs) |
| **Mapas** | react-native-maps (Google Maps Provider) |
| **IA Generativa** | Google Gemini API (gemini-flash-latest) |
| **Iconos** | lucide-react-native |
| **Estado Global** | React Context API |
| **Datos** | Mock Data (mockData.js) con URLs de Unsplash |
| **Despliegue de prueba** | Expo Go (QR Code scan — sin instalación) |

---

*Documento generado para Workshop 4 — Concept Selection + Concept Test Sprint*  
*Proyecto PetTrust © 2026*
