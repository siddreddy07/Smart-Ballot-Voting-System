let pendingTask = null;
let registrationResult = null;

export const startRegistration = (req, res) => {
  console.log('📥 Received request to start registration');
  pendingTask = { task: 'register' };
  registrationResult = null;
  console.log('📥 Task queued, result reset');
  setTimeout(() => {
    if (pendingTask) {
      console.log('🕒 Clearing stale task');
      pendingTask = null;
    }
  }, 60000); // Clear after 1 minute
  res.status(200).json({ message: 'Registration task queued' });
};

export const checkTask = (req, res) => {
  console.log('📡 Check task requested, current pendingTask:', pendingTask);
  const taskToSend = pendingTask || { task: 'none' };
  res.json(taskToSend);
  if (pendingTask) {
    pendingTask = null;
    console.log('📡 Task sent and cleared');
  } else {
    console.log('📡 No task pending, sent "none"');
  }
};

export const registrationresult = (req, res) => {
  const { success, fingerprintID, rfidUID } = req.body;
  console.log('📤 Registration Result:');
  console.log(`✅ Success: ${success}`);
  if (success) {
    console.log(`🧠 Fingerprint ID: ${fingerprintID}`);
    console.log(`🪪 RFID UID: ${rfidUID}`);
    registrationResult = { success, fingerprintID, rfidUID };
  } else {
    console.log('❌ Registration failed');
    registrationResult = { success: false };
  }
  res.status(200).json({ message: 'Result received' });
};

export const getRegistrationResult = (req, res) => {
  console.log('📡 Get registration result requested, current result:', registrationResult);
  if (registrationResult) {
    pendingTask = null
    res.json(registrationResult);
  } else {
    res.json({ success: false, message: 'No result available' });
  }
};