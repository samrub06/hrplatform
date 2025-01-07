# New Job Offer: {{jobData.name}}

## Job Details
- **Company:** {{jobData.company_name}}
- **Location:** {{jobData.city}}
- **Work Type:** {{jobData.work_condition}}
- **Link Referral:** {{jobData.link_referral}}
- **Required Experience:** {{jobData.global_year_experience}} years

## Job Description
{{jobData.description}}

## Required Skills
{{#each jobData.skills}}
- **{{name}}**
  - Experience: {{years_required}} years
  - Level: {{level}}
{{/each}}

## Contact Information
- **Name:** {{jobData.contact_name}}
- **Email:** {{jobData.email_address}}
- **Phone:** {{jobData.phone_number}}

---
*This email was automatically sent by HR Platform.*
© {{currentYear}} HR Platform. All rights reserved. 