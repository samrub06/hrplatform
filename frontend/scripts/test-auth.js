#!/usr/bin/env node

/**
 * Script de test automatisé pour l'authentification
 * Usage: node scripts/test-auth.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

async function testAuthFlow() {
  console.log('🧪 === TEST D\'AUTHENTIFICATION ===\n');

  try {
    // 1. Test de login
    console.log('1️⃣ Test de login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    console.log('✅ Login réussi');
    console.log('Tokens reçus:', {
      accessToken: loginResponse.data.accessToken ? '✅ Présent' : '❌ Absent',
      refreshToken: loginResponse.data.refreshToken ? '✅ Présent' : '❌ Absent'
    });

    // 2. Test de récupération des permissions
    console.log('\n2️⃣ Test de récupération des permissions...');
    const permissionsResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.accessToken}`
      }
    });
    
    console.log('✅ Permissions récupérées');
    console.log('Permissions:', permissionsResponse.data.permissions?.length || 0, 'trouvées');

    // 3. Test de refresh token
    console.log('\n3️⃣ Test de refresh token...');
    const refreshResponse = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {}, {
      headers: {
        'Cookie': `refreshToken=${loginResponse.data.refreshToken}`
      }
    });
    
    console.log('✅ Refresh token réussi');
    console.log('Nouveau access token:', refreshResponse.data.accessToken ? '✅ Présent' : '❌ Absent');

    // 4. Test de logout
    console.log('\n4️⃣ Test de logout...');
    await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${refreshResponse.data.accessToken}`
      }
    });
    
    console.log('✅ Logout réussi');

    console.log('\n🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    process.exit(1);
  }
}

// Fonction pour tester les permissions spécifiques
async function testPermissions() {
  console.log('\n🔑 === TEST DES PERMISSIONS ===\n');

  try {
    // Login d'abord
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    // Récupérer les permissions
    const permissionsResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.accessToken}`
      }
    });

    const permissions = permissionsResponse.data.permissions || [];
    
    console.log('Permissions trouvées:');
    permissions.forEach(permission => {
      console.log(`- ${permission.domain}:`, {
        read: permission.can_read ? '✅' : '❌',
        create: permission.can_create ? '✅' : '❌',
        edit: permission.can_edit ? '✅' : '❌',
        delete: permission.can_delete ? '✅' : '❌'
      });
    });

    // Test des domaines spécifiques
    const testDomains = ['dashboard', 'users', 'contacts', 'reports', 'settings'];
    console.log('\nTest des domaines:');
    
    testDomains.forEach(domain => {
      const permission = permissions.find(p => p.domain === domain);
      if (permission) {
        console.log(`✅ ${domain}: Permission trouvée`);
      } else {
        console.log(`❌ ${domain}: Permission manquante`);
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors du test des permissions:', error.message);
  }
}

// Exécution des tests
async function runTests() {
  await testAuthFlow();
  await testPermissions();
}

// Vérification des variables d'environnement
function checkEnvironment() {
  console.log('🔧 === VÉRIFICATION DE L\'ENVIRONNEMENT ===\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'JWT_SECRET'
  ];

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Défini`);
    } else {
      console.log(`❌ ${varName}: Non défini`);
    }
  });

  console.log(`\n🌐 URL de base: ${BASE_URL}`);
  console.log('');
}

// Main
if (require.main === module) {
  checkEnvironment();
  runTests().catch(console.error);
}

module.exports = { testAuthFlow, testPermissions }; 