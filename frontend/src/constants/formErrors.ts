export const formErrors = {
  required: {
    skill: {
      name: 'Veuillez saisir le nom de la compétence',
      level: 'Veuillez sélectionner un niveau',
      years: 'Veuillez indiquer les années d\'expérience'
    },
    job: {
      title: 'Veuillez saisir le titre du poste',
      description: 'Veuillez saisir une description',
      salary: 'Veuillez indiquer le salaire'
    },
    user: {
      firstName: 'Veuillez saisir le prénom',
      lastName: 'Veuillez saisir le nom',
      email: 'Veuillez saisir une adresse email'
    }
  },
  invalid: {
    email: 'Veuillez saisir une adresse email valide',
    phone: 'Veuillez saisir un numéro de téléphone valide',
    number: 'Veuillez saisir un nombre valide'
  },
  custom: {
    minLength: (field: string, min: number) => `${field} doit contenir au moins ${min} caractères`,
    maxLength: (field: string, max: number) => `${field} ne doit pas dépasser ${max} caractères`,
    minValue: (field: string, min: number) => `${field} doit être supérieur à ${min}`,
    maxValue: (field: string, max: number) => `${field} doit être inférieur à ${max}`
  }
}; 