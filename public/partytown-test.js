// Simple test script to verify Partytown is working
console.log('🧪 Partytown test script loaded!');
console.log('🧪 Script location:', typeof window !== 'undefined' ? 'Main Thread' : 'Web Worker');
console.log('🧪 User Agent:', navigator.userAgent);

// Test if we can access forwarded functions
if (typeof window !== 'undefined') {
  console.log('🧪 Window object available');
  console.log('🧪 Testing dataLayer access...');
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'partytown_test',
    test_data: 'Hello from Partytown!'
  });
  
  console.log('🧪 DataLayer push completed:', window.dataLayer);
}

// Set a global variable to test
window.PARTYTOWN_TEST_LOADED = true;
console.log('✅ Partytown test script execution complete!');