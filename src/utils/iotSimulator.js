export const generateHeartRate = (base = 75) => {
  return base + Math.floor(Math.random() * 10) - 5;
};

export const generateLocationOffset = (coord) => {
  return coord + (Math.random() - 0.5) * 0.001;
};

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
