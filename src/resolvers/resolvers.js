const fetchResourceData = require('../fetch/searchResource');

const resolvers = {
  Query: {
    getAppointmentByDate: async (_, { date }) => {
      try {
        const [getAllDoctor, getAllPatient] = await Promise.all([
          fetchResourceData('Practitioner', {}, [], []),
          fetchResourceData('Patient', {}, [], [])
        ]);
        const getAppointment = await fetchResourceData('Appointment', { date: date }, getAllDoctor, getAllPatient);
        return getAppointment;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error; // Lanza el error para que Apollo Server lo maneje
      }
    },
    getPatientByName: async (_, { name }) => {
      try {
        const allPatient = fetchResourceData('Patient', name ? { "family:contains": name } : {}, [], [])
        return allPatient;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error; // Lanza el error para que Apollo Server lo maneje
      }
    },
    getPractitionerByName: async (_, { name }) => {
      try {
        const allPractitioner = fetchResourceData('Practitioner', name ? { "family:contains": name } : {}, [], [])
        return allPractitioner;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error; // Lanza el error para que Apollo Server lo maneje
      }
    }
  }
};


module.exports = resolvers;
