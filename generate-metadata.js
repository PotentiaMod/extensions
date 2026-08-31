#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const FILES_DIR = path.join(__dirname, 'extensions/other');
const OUTPUT_FILE = path.join(__dirname, 'generated-metadata', 'extensions-v0.json');
const SITE_DATA_FILE = path.join(__dirname, 'site-data.js');
const VERSIONS_FILE = path.join(__dirname, 'versions.json');

function extractDescription(content) {
  const match = content.match(/^[ \t]*\/\/\s*Description\s*:\s*(.+)$/im);
  return match ? match[1].trim() : '';
}

function createSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function processExtensions(dir, isFeatured = false) {
  const extensions = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return extensions;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (!stats.isFile()) continue;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const description = extractDescription(content);
      const name = file.replace('.js', '');
      const slug = createSlug(name);
      
      extensions.push({
        slug: name,
        id: name,
        name,
        description,
        image: `${name}.png`,
        by: [
          {
            name: "Unknown",
            link: null
          }
        ],
      });
      
      console.log(`✓ Processed: ${file}${description ? '' : ' (no description)'}`);
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  }
  
  return extensions;
}

function generateMetadata() {
  console.log('Generating extension metadata...\n');
 
  
  console.log('\nProcessing file extensions:');
  const fileExtensions = processExtensions(FILES_DIR, false);
  
  fileExtensions.sort((a, b) => a.name.localeCompare(b.name));
  
  const allExtensions = fileExtensions;
  
  const metadata = {
    extensions: allExtensions.map(ext => ({
      slug: ext.slug,
      id: ext.id,
      name: ext.name,
      description: ext.description,
      image: ext.image,
      by: ext.by
    }))
  };
  
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));

  const versions = fs.existsSync(VERSIONS_FILE)
    ? JSON.parse(fs.readFileSync(VERSIONS_FILE, 'utf8'))
    : {};
  const siteData = {
    versions,
    metadata
  };
  fs.writeFileSync(SITE_DATA_FILE, `window.extensionSiteData = ${JSON.stringify(siteData, null, 2)};\n`);
  
  console.log(`\n✓ Metadata generated successfully!`);
  console.log(`  Total extensions: ${allExtensions.length}`);
  console.log(`  Other: ${fileExtensions.length}`);
  console.log(`  Output: ${OUTPUT_FILE}`);
  console.log(`  Site data: ${SITE_DATA_FILE}`);
}

try {
  generateMetadata();
} catch (error) {
  console.error('Error generating metadata:', error);
  process.exit(1);
}
