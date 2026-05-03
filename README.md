# 🐾 PetTrust App - Guía de Instalación y Uso

¡Bienvenido al repositorio de PetTrust! Esta aplicación fue construida con **React Native** y **Expo**. 
Integra **Google Gemini (IA Generativa)** para el matchmaking de paseos y **Geolocalización GPS** para el rastreo en tiempo real.

A continuación, encontrarás los pasos detallados para descargar, instalar y correr el proyecto en tu propia máquina.

---

## 🛠️ 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu computadora:

1. **[Node.js](https://nodejs.org/es/)** (Versión 18 o superior).
2. **[Git](https://git-scm.com/downloads)** (Para descargar el código).
3. **App Expo Go:** Descarga la aplicación gratuita "Expo Go" en tu celular desde la [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent) o la [App Store (iOS)](https://apps.apple.com/us/app/expo-go/id982107779).

---

## 🚀 2. Pasos para iniciar el proyecto

Sigue estos comandos paso a paso en tu terminal (Símbolo del sistema, PowerShell, o terminal de VSCode):

### Paso 2.1: Clonar el repositorio
Descarga el código fuente a tu computadora ejecutando:
```bash
git clone https://github.com/juanpit2/HCI-APP.git
```

### Paso 2.2: Entrar a la carpeta del proyecto
```bash
cd HCI-APP
```
*(Nota: Si la carpeta principal al clonar tiene otro nombre, simplemente asegúrate de navegar usando `cd` hasta llegar donde esté el archivo `package.json`)*.

### Paso 2.3: Instalar las dependencias
Este comando descargará todas las librerías necesarias (como React Navigation, Maps, Lucide Icons, etc.):
```bash
npm install
```

### Paso 2.4: Ejecutar el servidor de desarrollo
Finalmente, levanta el proyecto ejecutando:
```bash
npx expo start
```
*(Si tienes problemas de red o conexión bloqueada por el firewall de tu universidad/trabajo, puedes usar `npx expo start --tunnel` como alternativa).*

---

## 📱 3. ¿Cómo probar la App?

Una vez ejecutes el comando anterior, verás un **Código QR** grande en tu terminal.

**Si tienes un teléfono físico (Recomendado):**
1. Asegúrate de que tu celular y tu computadora estén conectados a la **misma red Wi-Fi**.
2. Abre la aplicación **Expo Go** en tu celular.
3. Toca la opción **"Scan QR Code"** (Escanear código QR).
4. Apunta la cámara al QR de tu terminal y espera a que termine de cargar el bundle. ¡Listo!

**Si prefieres usar un Emulador en tu PC:**
* Si tienes Android Studio instalado, presiona la tecla `a` en tu terminal para abrirlo en el emulador de Android.
* Si tienes una Mac con Xcode, presiona la tecla `i` para abrirlo en el simulador de iPhone.

---

## 🔑 4. Notas sobre las APIs (Importante)

Para propósitos de este Workshop y demostración, las credenciales y APIs necesarias ya se encuentran integradas en el código:

* **IA Generativa (Gemini):** La API Key está temporalmente configurada dentro de `src/services/geminiService.js` para que el flujo de chat y recomendación funcione de inmediato tras clonar (Out-of-the-box).
* **Google Maps:** Se utilizan los componentes nativos de `react-native-maps` y los servicios de ubicación de Expo (`expo-location`). Al abrir la app en tu celular, te pedirá permisos de Ubicación; **por favor acéptalos** para poder probar el simulador de GPS ("Live Tracking").

---

## 🏗️ 5. Estructura rápida del proyecto

Si deseas revisar el código, aquí tienes las carpetas más importantes:
* `/src/screens/`: Contiene todas las vistas principales (Home, Live Tracking, Activity, Explore).
* `/src/services/`: Contiene la lógica del motor de IA (`geminiService.js`).
* `/src/constants/`: Contiene la base de datos simulada (`mockData.js`) con dueños y mascotas.
* `/docs/`: Documentación del proyecto y guiones de presentación del workshop.

¡Disfruta probando PetTrust! 
