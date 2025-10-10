// export const patientAPI = {
//   async getAll() {
//     const res = await fetch('http://localhost:5000/patients');
//     if (!res.ok) {
//       throw new Error('Failed to fetch patients');
//     }
//     return res.json();
//   },

//   async getById(id: string) {
//     const res = await fetch(`http://localhost:5000/patients/${id}`);
//     if (!res.ok) {
//       throw new Error('Failed to fetch patient');
//     }
//     return res.json();
//   },

//   async create(patient: any) {
//     const res = await fetch('http://localhost:5000/patients', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(patient),
//     });
//     if (!res.ok) {
//       throw new Error('Failed to create patient');
//     }
//     return res.json();
//   },

//   async update(id: string, patient: any) {
//     const res = await fetch(`http://localhost:5000/patients/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(patient),
//     });
//     if (!res.ok) {
//       throw new Error('Failed to update patient');
//     }
//     return res.json();
//   },
// };
