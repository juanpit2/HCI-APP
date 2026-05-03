import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 'voluntario' | 'dueño'
  const [userRole, setUserRole] = useState('voluntario');
  
  // Chat Persistence
  const [chatMessages, setChatMessages] = useState([
    {
      id: '0',
      role: 'model',
      text: 'Hola! Soy PetTrust AI. Puedo ayudarte a encontrar el perro ideal para pasear según tus preferencias. Cuéntame, ¿qué tipo de perro buscas?',
    },
  ]);
  const [chatHistory, setChatHistory] = useState([]);

  // Dueño's Data
  const [myDogs, setMyDogs] = useState([
    {
      id: 'my-dog-1',
      name: 'Bruno',
      breed: 'Golden Retriever',
      age: 2,
      weight: 25,
      energyLevel: 'alto',
      temperament: ['juguetón', 'amigable'],
      photo: null,
      status: 'En casa' // 'En casa', 'En paseo', 'Buscando paseador'
    }
  ]);

  // Solicitudes de paseo
  const [walkRequests, setWalkRequests] = useState([
    {
      id: 'mock-accepted',
      dogId: 'dog-1',
      dogName: 'Bruno',
      date: 'Hoy',
      time: '10:00 AM',
      status: 'ACCEPTED',
      walker: { name: 'Juan Pérez', phone: '123456789' },
      routePoints: ['Parque del Perro', 'San Antonio']
    }
  ]);

  return (
    <AppContext.Provider value={{
      userRole, setUserRole,
      chatMessages, setChatMessages,
      chatHistory, setChatHistory,
      myDogs, setMyDogs,
      walkRequests, setWalkRequests
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
