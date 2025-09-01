#!/usr/bin/env node

/**
 * Script pour nettoyer l'ancienne structure de app/
 * 
 * Usage: node scripts/cleanup-app-structure.js
 */

const fs = require('fs')
const path = require('path')

const oldFiles = [
  'app/actions/auth.ts',
  'app/actions/user/types.ts',
  'app/actions/user/utils.ts',
  'app/actions/user/index.ts'
]

const oldDirs = [
  'app/actions',
  'app/login',
  'app/signup',
  'app/getstarted'
]

function removeFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
    console.log(`✅ Supprimé: ${filePath}`)
  } else {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`)
  }
}

function removeDir(dirPath) {
  const fullPath = path.join(process.cwd(), dirPath)
  if (fs.existsSync(fullPath)) {
    fs.rmdirSync(fullPath, { recursive: true })
    console.log(`✅ Supprimé: ${dirPath}`)
  } else {
    console.log(`⚠️  Dossier non trouvé: ${dirPath}`)
  }
}

console.log('🧹 Nettoyage de l\'ancienne structure app/...\n')

// Supprimer les anciens fichiers
oldFiles.forEach(removeFile)

console.log('\n📁 Suppression des anciens dossiers...\n')

// Supprimer les anciens dossiers
oldDirs.forEach(removeDir)

console.log('\n✅ Nettoyage terminé !')
console.log('\n📋 Nouvelle structure:')
console.log('app/')
console.log('├── (auth)/')
console.log('│   ├── login/')
console.log('│   ├── signup/')
console.log('│   └── layout.tsx')
console.log('├── (dashboard)/')
console.log('│   ├── account/')
console.log('│   └── layout.tsx')
console.log('├── api/')
console.log('├── lib/')
console.log('│   ├── actions/')
console.log('│   ├── guards/')
console.log('│   ├── hooks/')
console.log('│   └── providers.tsx')
console.log('├── globals.css')
console.log('├── layout.tsx')
console.log('└── page.tsx') 