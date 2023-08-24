const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb3NlNDU2bGh5b0BnbWFpbC5jb20iLCJpYXQiOjE2OTEyNjg1MTQ3MzMsImV4cCI6MTY5MTI2OTExOTUzM30.QUBRQX1cehzJywR_1ks0ak1LX5IuhY71hwdpGinpkNY'; // Reemplaza con tu token Bearer real
const headers = {
    Authorization: `Bearer ${token}`
};

const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };


const buildFullName = (nameObject) => {
    const fullName = [];
    if (nameObject) {
        if (nameObject.given && nameObject.given.length > 0) {
            fullName.push(nameObject.given.join(' '));
        }
        if (nameObject.family) {
            fullName.push(nameObject.family);
        }
    }
    return fullName.join(' ');
};

const extractIdByParticipant = (participants = [], type = "", allPatients = [], allDoctors = []) => {
    const participant = participants.find(item => item.actor.reference.startsWith(`${type}/`));
    if (participant) {
        const id = participant.actor.reference.split('/')[1];
        return type === 'Patient' ? allPatients.find(patient => patient.id === id) : allDoctors.find(doctor => doctor.id === id);
    }
    return null;
};

const fetchResourceData = async (resourceType, params, getAllDoctor, getAllPatient) => {
    try {
        const response = await axios.post(
            'https://us-central1-doctoc-test-f0d7b.cloudfunctions.net/searchResource',
            {
                resourceType,
                params: { ...params }
            },
            { headers }
        );
        const data = response.data.resourcesFound.resourcesData;

        return data.map((item) => {
            const { resource } = item;
            const { birthDate, gender, id, name, specialty, start, end, serviceType, participant } = resource

            return {
                id: id,
                birthDate: birthDate,
                gender: gender,
                name: buildFullName(name && name[0]),
                specialty: specialty,
                start: new Date(start).toLocaleDateString('es', options),
                end: new Date(end).toLocaleDateString('es', options),
                serviceType: serviceType && serviceType[0].coding[0].display,
                patient: participant && extractIdByParticipant(participant, 'Patient', getAllPatient, getAllDoctor),
                doctor: extractIdByParticipant(participant, 'Practitioner', getAllPatient, getAllDoctor)
            };
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error; // Lanza el error para que Apollo Server lo maneje
    }
};

module.exports = fetchResourceData;