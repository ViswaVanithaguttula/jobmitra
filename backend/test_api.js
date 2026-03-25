async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- STARTING INTEGRATION TESTS ---');

  try {
    // 1. Array of exams to seed or check
    const examsRes = await fetch(`${baseUrl}/exams`);
    const exams = await examsRes.json();
    console.log('Exams fetched:', exams.exams.length);
    
    if (exams.exams.length === 0) {
      console.error('ERROR: No exams found in database.');
      process.exit(1);
    }

    const targetExamId = exams.exams[0]._id;

    // 2. Register
    console.log('\nTesting Registration API...');
    const randomEmail = `test_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test Aspirant",
        email: randomEmail,
        password: "securepassword",
        age: "24",
        qualification: "Graduate",
        category: "General",
        state: "Maharashtra"
      })
    });
    
    const regData = await regRes.json();
    if (!regRes.ok) {
      console.error('Registration failed:', regData);
      process.exit(1);
    }
    console.log('Registration OK. Token received:', !!regData.token);
    const token = regData.token;

    // 3. Login
    console.log('\nTesting Login API...');
    const logRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: randomEmail,
        password: "securepassword"
      })
    });
    const logData = await logRes.json();
    if (!logRes.ok) {
      console.error('Login failed:', logData);
      process.exit(1);
    }
    console.log('Login OK. Token integrity validated:', logData.token === token);

    // 4. Eligibility
    console.log('\nTesting Eligibility Engine API...');
    const eligRes = await fetch(`${baseUrl}/eligibility/check`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        age: 24,
        qualification: "Graduate",
        category: "General"
      })
    });
    const eligData = await eligRes.json();
    if (!eligRes.ok) {
      console.error('Eligibility check failed:', eligData);
      process.exit(1);
    }
    console.log(`Eligibility OK. Found ${eligData.totalEligible} matching exams.`);

    // 5. Strategy Planner
    console.log('\nTesting Strategy Generator API...');
    const planRes = await fetch(`${baseUrl}/planner/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        targetExamId,
        hoursPerDay: 5,
        preparationLevel: "Beginner"
      })
    });
    const planData = await planRes.json();
    if (!planRes.ok) {
      console.error('Strategy Generator failed:', planData);
      process.exit(1);
    }
    console.log('Strategy Generator OK. Weeks generated:', planData.schedule.length);

    console.log('\n--- ALL API INTEGRATION TESTS PASSED SUCCESSFULLY! ---');

  } catch (error) {
    console.error('Test script crashed:', error);
    process.exit(1);
  }
}

runTests();
