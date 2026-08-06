const API_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
  };

  async function testEndpoint(name, method, url, data = null, headers = {}, expectFail = false) {
    results.total++;
    try {
      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };
      if (data && method !== 'GET') {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(`${API_URL}${url}`, fetchOptions);
      const responseData = await response.json().catch(() => null);

      if ((response.ok && !expectFail) || (!response.ok && expectFail)) {
        console.log(`✅ [PASS] ${name} (${response.status})`);
        results.passed++;
        return { success: true, data: responseData, status: response.status };
      } else {
        console.log(`❌ [FAIL] ${name} (${response.status})`);
        console.log(`   Message: ${JSON.stringify(responseData?.message || responseData)}`);
        results.failed++;
        results.errors.push({ name, status: response.status, data: responseData });
        return { success: false, data: responseData, status: response.status };
      }
    } catch (error) {
      console.log(`❌ [ERROR] ${name}`);
      console.log(`   ${error.message}`);
      results.failed++;
      results.errors.push({ name, error: error.message });
      return { success: false, error: error.message };
    }
  }

  console.log('--- STARTING API REGRESSION TEST ---');

  // 1. PUBLIC ENDPOINTS
  await testEndpoint('Get Categories', 'GET', '/categories');
  await testEndpoint('Get Knowledge Articles', 'GET', '/knowledge');
  await testEndpoint('Get Marketplace Analytics', 'GET', '/analytics/marketplace');
  await testEndpoint('Get Summary Analytics', 'GET', '/analytics/summary');

  // 2. AUTHENTICATION (Register & Login)
  const buyerEmail = `buyer${Date.now()}@test.com`;
  const supplierEmail = `supplier${Date.now()}@test.com`;
  const password = 'Password123!';

  // Buyer Registration
  await testEndpoint('Register Buyer', 'POST', '/auth/buyer/register', {
    email: buyerEmail,
    password,
    role: 'Buyer',
    name: 'Test Buyer Corp',
    contactName: 'John Doe'
  });

  const buyerLogin = await testEndpoint('Login Buyer', 'POST', '/auth/buyer/login', {
    email: buyerEmail,
    password
  });
  
  const buyerToken = buyerLogin.data?.data?.accessToken;

  // Supplier Registration
  await testEndpoint('Register Supplier', 'POST', '/auth/supplier/register', {
    email: supplierEmail,
    password,
    role: 'Supplier',
    name: 'Test Supplier Corp',
    contactName: 'Jane Smith',
    location: 'New York, USA'
  });

  const supplierLogin = await testEndpoint('Login Supplier', 'POST', '/auth/supplier/login', {
    email: supplierEmail,
    password
  });

  const supplierToken = supplierLogin.data?.data?.accessToken;

  // 3. PROTECTED BUYER ENDPOINTS
  if (buyerToken) {
    const bHeaders = { Authorization: `Bearer ${buyerToken}` };
    await testEndpoint('Get Buyer Profile', 'GET', '/buyer/profile', null, bHeaders);
    await testEndpoint('Get Buyer Orders', 'GET', '/buyer/orders', null, bHeaders);
    await testEndpoint('Get Buyer Analytics', 'GET', '/analytics/buyer', null, bHeaders);
  } else {
    console.log('⚠️ Skipping Buyer Protected endpoints (No Token)');
  }

  // 4. PROTECTED SUPPLIER ENDPOINTS
  if (supplierToken) {
    const sHeaders = { Authorization: `Bearer ${supplierToken}` };
    await testEndpoint('Get Supplier Profile', 'GET', '/supplier/profile', null, sHeaders);
    await testEndpoint('Get Supplier Dashboard', 'GET', '/supplier/dashboard', null, sHeaders);
    await testEndpoint('Get Supplier Analytics', 'GET', '/analytics/supplier', null, sHeaders);
    await testEndpoint('Get Supplier Orders', 'GET', '/supplier/orders', null, sHeaders);
    await testEndpoint('Get Supplier Products', 'GET', '/supplier/products', null, sHeaders);
  } else {
    console.log('⚠️ Skipping Supplier Protected endpoints (No Token)');
  }

  // 5. SECURITY TESTS (Unauthorized Access)
  await testEndpoint('Unauthorized Profile Access', 'GET', '/buyer/profile', null, {}, true); // Should return 401

  // 6. REVIEWS
  await testEndpoint('Get Reviews', 'GET', '/reviews/dashboard/supplier', null, { Authorization: `Bearer ${supplierToken}` });

  console.log('\n--- RESULTS ---');
  console.log(`Total: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log('Errors:', JSON.stringify(results.errors, null, 2));
  }
}

runTests();
