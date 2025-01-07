# Nouvelle offre d'emploi : {{jobData.name}}

## Détails du poste
- **Entreprise :** {{jobData.company_name}}
- **Localisation :** {{jobData.city}}
- **Type de travail :** {{jobData.work_condition}}
- **Link Referral :** {{jobData.link_referral}}
- **Expérience requise :** {{jobData.global_year_experience}} ans

## Description du poste
{{jobData.description}}

## Compétences requises
{{#each jobData.skills}}
- **{{name}}**
  - Expérience : {{years_required}} ans
  - Niveau : {{level}}
{{/each}}

## Contact
- **Nom :** {{jobData.contact_name}}
- **Email :** {{jobData.email_address}}
- **Téléphone :** {{jobData.phone_number}}

---
*Cet email a été envoyé automatiquement par HR Platform.*
© {{currentYear}} HR Platform. Tous droits réservés. 