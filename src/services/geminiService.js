// ============================================================
// SERVICIO DE IA — Google Gemini API Integration
// ============================================================
// Este servicio conecta con la API real de Gemini para generar
// recomendaciones inteligentes basadas en lenguaje natural.

import { DOGS, SHELTERS, OWNERS } from '../constants/mockData';

// Asegúrate de definir esta variable en el archivo .env de tu proyecto
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Genera el contexto de los perros disponibles para que Gemini los conozca.
 */
const buildDogContext = () => {
  return DOGS.map(dog => {
    const shelter = SHELTERS.find(s => s.id === dog.shelterId);
    const owner = OWNERS.find(o => o.id === dog.ownerId);
    const address = shelter?.address || owner?.address || 'Cali';
    const source = shelter ? `Refugio: ${shelter.name}` : `Dueño: ${owner?.name}`;

    return `- [ID: ${dog.id}] ${dog.name}: Ubicación: ${address}. ${dog.breed}, ${dog.age} años, ${dog.weight}kg, energía ${dog.energyLevel}, tamaño ${dog.size}, temperamento: ${dog.temperament.join(', ')}. Lleva ${dog.daysSinceLastWalk} días sin pasear. ${source}. ${dog.specialNeeds.length > 0 ? 'Necesidades: ' + dog.specialNeeds.join(', ') : ''}`;
  }).join('\n');
};

/**
 * Envía un mensaje a Gemini y obtiene una respuesta inteligente.
 */
export const askGemini = async (userMessage, conversationHistory = []) => {
  const systemPrompt = `Eres PetTrust AI, un asistente inteligente de una app que conecta voluntarios con perros abandonados en refugios o de dueños que necesitan ayuda. Tu misión es ayudar a los usuarios a encontrar el perro ideal para pasear según sus preferencias y ubicación.

DATOS DE PERROS DISPONIBLES:
${buildDogContext()}

REGLAS:
- Responde siempre en español
- Sé amigable, empático y breve (máximo 3-4 oraciones)
- Si el usuario describe qué busca O MENCIONA UNA UBICACIÓN (ej. "Bulevar del Río", "San Antonio"), recomienda perros que estén CERCA de esa ubicación basándote en su dirección.
- Explica POR QUÉ recomiendas ese perro (compatibilidad o cercanía)
- ⚠️ MUY IMPORTANTE: Si recomiendas uno o más perros específicos, al final de tu mensaje DEBES añadir exactamente esto: |||DOG_IDS: <ID_DEL_PERRO_1>,<ID_DEL_PERRO_2> (Ejemplo: |||DOG_IDS: dog-1,dog-2)
- ⚠️ MUY IMPORTANTE: Si el usuario te pide una ubicación o barrio donde NO hay perros listados exactamente (ej. "Jamundí" o "Norte de Cali"), NO TE NIEGUES. Selecciona a los 2 o 3 perros que estén en la zona más cercana posible (ej. "Ciudad Jardín" si pidió el Sur/Jamundí) y ofrécelos como las mejores alternativas.
- Siempre que el usuario mencione una ubicación (cerca o lejos), al final del mensaje debes añadir: |||ZONA: <NOMBRE_UBICACION>
- Si preguntan algo no relacionado con perros/refugios, redirige amablemente`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }],
    },
    {
      role: 'model',
      parts: [{ text: '¡Entendido! Soy PetTrust AI, listo para ayudarte a encontrar tu compañero de paseo ideal. ¿Qué tipo de perro te gustaría pasear hoy?' }],
    },
    ...conversationHistory,
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'Error de API');
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) throw new Error('Respuesta vacía de Gemini');

    return {
      success: true,
      message: aiResponse,
    };
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return {
      success: false,
      message: 'No pude conectar con la IA. Verifica tu conexión a internet o tu API Key.',
      error: error.message,
    };
  }
};

/**
 * Genera un análisis post-paseo con IA real.
 */
export const generateWalkReport = async (dogName, duration, distance, steps) => {
  const prompt = `Genera un breve reporte de paseo (3-4 líneas) para un paseo con ${dogName}. 
Datos: duración ${Math.floor(duration / 60)} minutos, distancia ${distance}km, ${steps} pasos. 
Incluye un consejo para el próximo paseo y una observación sobre el bienestar del perro.`;

  return await askGemini(prompt);
};

/**
 * Genera recomendaciones personalizadas basadas en texto libre del usuario.
 */
export const getAIRecommendation = async (userDescription) => {
  const prompt = `El usuario dice: "${userDescription}". 
Basándote en los perros disponibles, recomienda los 2 mejores matches y explica por qué.`;

  return await askGemini(prompt);
};

/**
 * Sugiere rutas de paseo basadas en una dirección o barrio de Cali.
 */
export const suggestWalkRoute = async (location) => {
  const prompt = `El usuario vive en o cerca de "${location}" en Cali, Colombia. 
  Sugiere 3 rutas de paseo para un perro, priorizando parques, zonas verdes y seguridad. 
  Formatea la respuesta como un objeto JSON con un array de rutas, cada una con un nombre, una descripción breve y los puntos clave del recorrido.
  Ejemplo: { "routes": [{ "name": "Ruta de los Parques", "desc": "Ideal para sombra", "points": ["Parque del Perro", "Parque Panamericano"] }] }`;

  const response = await askGemini(prompt);

  if (response.success) {
    try {
      // Intentar extraer el JSON de la respuesta de texto
      const jsonStr = response.message.match(/\{[\s\S]*\}/)?.[0];
      if (jsonStr) {
        return { success: true, data: JSON.parse(jsonStr) };
      }
    } catch (e) {
      console.error('Failed to parse AI routes:', e);
    }
  }

  // Fallback en caso de error
  return {
    success: true,
    data: {
      routes: [
        { name: "Ruta del Río Cali", desc: "Paseo fresco por el sendero del río", points: ["Gato de Tejada", "Museo La Tertulia"] },
        { name: "Circuito San Antonio", desc: "Caminata histórica con brisa", points: ["Parque del Acueducto", "Capilla San Antonio"] }
      ]
    }
  };
};
