// ============================================================
// MOTOR DE IA — Sistema de Matching Inteligente
// ============================================================
// Este motor analiza datos del usuario y del perro para generar
// recomendaciones personalizadas usando scoring ponderado.

import { DOGS, SHELTERS, CURRENT_USER } from '../constants/mockData';

// ============================================================
// PESOS DEL ALGORITMO (suman 1.0)
// ============================================================
const WEIGHTS = {
  location: 0.20,      // Cercanía geográfica
  energy: 0.20,        // Compatibilidad de energía
  urgency: 0.25,       // Urgencia del perro (días sin pasear + ansiedad)
  experience: 0.15,    // Nivel de experiencia del usuario vs necesidades del perro
  availability: 0.10,  // Horarios compatibles
  sizePreference: 0.10, // Preferencia de tamaño
};

// ============================================================
// FUNCIONES DE SCORING INDIVIDUALES
// ============================================================

/**
 * Calcula la distancia entre dos coordenadas GPS usando Haversine.
 * Retorna distancia en kilómetros.
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Score de ubicación: Más cerca = mayor score.
 * 0-2 km = 100, 2-5 km = 70, 5-10 km = 40, >10 km = 10
 */
const calculateLocationScore = (userLocation, dogId) => {
  const dog = DOGS.find(d => d.id === dogId);
  const shelter = SHELTERS.find(s => s.id === dog.shelterId);
  if (!shelter || !userLocation) return 50;

  const distance = haversineDistance(
    userLocation.latitude,
    userLocation.longitude,
    shelter.location.latitude,
    shelter.location.longitude
  );

  if (distance <= 2) return 100;
  if (distance <= 5) return 70;
  if (distance <= 10) return 40;
  return 10;
};

/**
 * Score de energía: Qué tan compatible es la energía del usuario
 * con la del perro.
 */
const calculateEnergyScore = (userPreferredEnergy, dogEnergyLevel) => {
  if (userPreferredEnergy.includes(dogEnergyLevel)) return 100;

  // Penalización parcial si hay un nivel de diferencia
  const levels = ['bajo', 'medio', 'alto'];
  const userMaxIdx = Math.max(...userPreferredEnergy.map(e => levels.indexOf(e)));
  const dogIdx = levels.indexOf(dogEnergyLevel);
  const diff = Math.abs(userMaxIdx - dogIdx);

  if (diff === 1) return 60;
  return 25;
};

/**
 * Score de urgencia: Perros con más días sin pasear y más ansiedad
 * reciben mayor urgencia.
 */
const calculateUrgencyScore = (dog) => {
  const daysScore = Math.min(dog.daysSinceLastWalk * 15, 70); // Max 70 puntos por días
  const anxietyMap = { bajo: 0, medio: 15, alto: 30 };
  const anxietyScore = anxietyMap[dog.anxietyLevel] || 0;

  return Math.min(daysScore + anxietyScore, 100);
};

/**
 * Score de experiencia: Verifica si el usuario tiene la experiencia
 * necesaria para el perro.
 */
const calculateExperienceScore = (userExperience, dog) => {
  const levels = { principiante: 1, intermedio: 2, avanzado: 3 };
  const userLevel = levels[userExperience] || 1;

  // Si el perro tiene necesidades especiales, requiere más experiencia
  const needsExperience = dog.specialNeeds.length > 0 || !dog.goodWithOtherDogs;
  const requiredLevel = needsExperience ? 2 : 1;

  if (userLevel >= requiredLevel + 1) return 100; // Sobrecalificado
  if (userLevel >= requiredLevel) return 85;      // Justo
  if (userLevel === requiredLevel - 1) return 40; // Por debajo
  return 15; // Muy por debajo
};

/**
 * Score de disponibilidad: Verifica si los horarios coinciden.
 */
const calculateAvailabilityScore = (userAvailability, dogPreferredTime) => {
  if (userAvailability[dogPreferredTime]) return 100;

  // Si el usuario está disponible en algún momento, score parcial
  const anyAvailable = Object.values(userAvailability).some(v => v);
  return anyAvailable ? 50 : 10;
};

/**
 * Score de preferencia de tamaño.
 */
const calculateSizeScore = (userPreferredSize, dogSize) => {
  if (userPreferredSize.includes(dogSize)) return 100;
  return 30;
};

// ============================================================
// FUNCIÓN PRINCIPAL DE MATCHING
// ============================================================

/**
 * Calcula el match score total para un perro específico.
 * Retorna un objeto con el score total y el desglose de cada factor.
 */
export const calculateMatchScore = (userProfile, dog) => {
  const locationScore = calculateLocationScore(userProfile.location, dog.id);
  const energyScore = calculateEnergyScore(userProfile.preferredEnergy, dog.energyLevel);
  const urgencyScore = calculateUrgencyScore(dog);
  const experienceScore = calculateExperienceScore(userProfile.experience, dog);
  const availabilityScore = calculateAvailabilityScore(userProfile.availability, dog.preferredWalkTime);
  const sizeScore = calculateSizeScore(userProfile.preferredSize, dog.size);

  const totalScore = Math.round(
    WEIGHTS.location * locationScore +
    WEIGHTS.energy * energyScore +
    WEIGHTS.urgency * urgencyScore +
    WEIGHTS.experience * experienceScore +
    WEIGHTS.availability * availabilityScore +
    WEIGHTS.sizePreference * sizeScore
  );

  return {
    totalScore: Math.min(totalScore, 100),
    breakdown: {
      ubicacion: { score: locationScore, weight: WEIGHTS.location, label: 'Cercanía' },
      energia: { score: energyScore, weight: WEIGHTS.energy, label: 'Energía compatible' },
      urgencia: { score: urgencyScore, weight: WEIGHTS.urgency, label: 'Necesita ayuda' },
      experiencia: { score: experienceScore, weight: WEIGHTS.experience, label: 'Tu experiencia' },
      disponibilidad: { score: availabilityScore, weight: WEIGHTS.availability, label: 'Horario' },
      tamaño: { score: sizeScore, weight: WEIGHTS.sizePreference, label: 'Tamaño preferido' },
    },
    reasons: generateReasons(dog, locationScore, energyScore, urgencyScore),
  };
};

/**
 * Genera razones legibles de por qué se recomienda este perro.
 */
const generateReasons = (dog, locationScore, energyScore, urgencyScore) => {
  const reasons = [];

  if (urgencyScore >= 70) {
    reasons.push(` ${dog.name} lleva ${dog.daysSinceLastWalk} días sin pasear`);
  }
  if (dog.anxietyLevel === 'alto') {
    reasons.push(` Muestra signos de ansiedad — tu compañía ayudaría mucho`);
  }
  if (energyScore >= 80) {
    reasons.push(` Su nivel de energía coincide con tu perfil`);
  }
  if (locationScore >= 70) {
    reasons.push(` El refugio está muy cerca de ti`);
  }
  if (dog.goodWithKids && dog.goodWithOtherDogs) {
    reasons.push(` Es sociable y fácil de pasear`);
  }
  if (dog.adoptionReady) {
    reasons.push(` Listo para adopción — el contacto ayuda`);
  }

  return reasons.slice(0, 3); // Máximo 3 razones
};

// ============================================================
// FUNCIONES DE RECOMENDACIÓN
// ============================================================

/**
 * Obtiene todos los perros ordenados por match score.
 */
export const getRecommendedDogs = (userProfile) => {
  const recommendations = DOGS.map(dog => {
    const matchResult = calculateMatchScore(userProfile, dog);
    const shelter = SHELTERS.find(s => s.id === dog.shelterId);
    return {
      ...dog,
      matchScore: matchResult.totalScore,
      matchBreakdown: matchResult.breakdown,
      matchReasons: matchResult.reasons,
      shelterName: shelter?.name || 'Refugio desconocido',
      shelterDistance: shelter
        ? haversineDistance(
            userProfile.location.latitude,
            userProfile.location.longitude,
            shelter.location.latitude,
            shelter.location.longitude
          ).toFixed(1)
        : '?',
    };
  });

  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Obtiene los perros que más urgentemente necesitan ayuda.
 */
export const getUrgentDogs = () => {
  return DOGS
    .filter(dog => dog.daysSinceLastWalk >= 3 || dog.anxietyLevel === 'alto')
    .sort((a, b) => b.daysSinceLastWalk - a.daysSinceLastWalk)
    .map(dog => {
      const shelter = SHELTERS.find(s => s.id === dog.shelterId);
      return {
        ...dog,
        shelterName: shelter?.name || 'Refugio desconocido',
      };
    });
};

/**
 * Genera insights de IA personalizados para el usuario.
 */
export const generateAIInsights = (userProfile) => {
  const recommendations = getRecommendedDogs(userProfile);
  const urgentDogs = getUrgentDogs();
  const topMatch = recommendations[0];

  const insights = {
    topRecommendation: topMatch,
    urgentCount: urgentDogs.length,
    urgentDogs: urgentDogs,
    personalizedTips: [],
    impactStats: {
      totalDogsHelped: userProfile.dogsHelped,
      totalHours: userProfile.totalHours,
      estimatedStressReduction: Math.min(userProfile.totalWalks * 3, 85),
      adoptionContribution: Math.min(userProfile.totalWalks * 2, 60),
    },
  };

  // Tips personalizados según el perfil
  if (userProfile.experience === 'principiante') {
    insights.personalizedTips.push({
      iconName: 'Lightbulb',
      text: 'Te recomendamos empezar con perros tranquilos como Canela o Mía.',
    });
  }
  if (urgentDogs.length > 0) {
    insights.personalizedTips.push({
      iconName: 'AlertTriangle',
      text: `Hay ${urgentDogs.length} perros que necesitan atención urgente hoy.`,
    });
  }
  if (userProfile.totalWalks >= 10) {
    insights.personalizedTips.push({
      iconName: 'Star',
      text: `¡Increíble! Tus ${userProfile.totalWalks} paseos han reducido el estrés de los perros en un ${insights.impactStats.estimatedStressReduction}%.`,
    });
  }
  insights.personalizedTips.push({
    iconName: 'Clock',
    text: `Según tu disponibilidad, el mejor momento para pasear es en la ${userProfile.availability.mañana ? 'mañana' : 'tarde'}.`,
  });

  return insights;
};

/**
 * Predice el impacto de un paseo futuro con un perro específico.
 */
export const predictWalkImpact = (dog) => {
  const baseImpact = {
    stressReduction: 0,
    healthImprovement: 0,
    socializationBoost: 0,
    adoptionChanceIncrease: 0,
  };

  // Cuanto más tiempo sin pasear, mayor impacto
  baseImpact.stressReduction = Math.min(dog.daysSinceLastWalk * 8, 50);

  // Perros ansiosos se benefician más
  if (dog.anxietyLevel === 'alto') baseImpact.stressReduction += 25;
  if (dog.anxietyLevel === 'medio') baseImpact.stressReduction += 10;

  // Salud
  baseImpact.healthImprovement = dog.energyLevel === 'alto' ? 20 : dog.energyLevel === 'medio' ? 15 : 10;

  // Socialización
  baseImpact.socializationBoost = dog.totalWalks < 10 ? 30 : dog.totalWalks < 20 ? 15 : 5;

  // Adopción
  if (dog.adoptionReady) {
    baseImpact.adoptionChanceIncrease = Math.min(20 + (10 - dog.totalWalks), 35);
  }

  return baseImpact;
};

/**
 * Calcula datos para el gráfico radar de compatibilidad.
 */
export const getRadarData = (userProfile, dog) => {
  const match = calculateMatchScore(userProfile, dog);
  return [
    { label: 'Cercanía', value: match.breakdown.ubicacion.score },
    { label: 'Energía', value: match.breakdown.energia.score },
    { label: 'Urgencia', value: match.breakdown.urgencia.score },
    { label: 'Experiencia', value: match.breakdown.experiencia.score },
    { label: 'Horario', value: match.breakdown.disponibilidad.score },
    { label: 'Tamaño', value: match.breakdown.tamaño.score },
  ];
};
